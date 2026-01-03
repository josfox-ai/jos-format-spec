#!/bin/sh
#
# JOS Agent Service Installer for OpenWrt/GL.iNet
# Installs agent as init.d service
#
# Usage:
#   ./install-agent.sh install
#   ./install-agent.sh start|stop|status|register

CLOUD_ENDPOINT="${CLOUD_ENDPOINT:-https://cloud.josfox.mx}"
INSTALL_PATH="/usr/bin"
CONFIG_PATH="/etc/jos"
LOG_PATH="/tmp/log/jos"
INIT_SCRIPT="/etc/init.d/jos-agent"

status_msg() {
    case $2 in
        success) echo "  ✓ $1" ;;
        error) echo "  ✖ $1" ;;
        warning) echo "  ⚠ $1" ;;
        *) echo "  → $1" ;;
    esac
}

do_install() {
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "  JOS Agent Service - OpenWrt Installer"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""

    # Create directories
    status_msg "Creating directories..."
    mkdir -p "$CONFIG_PATH"
    mkdir -p "$LOG_PATH"
    mkdir -p "$CONFIG_PATH/artifacts"
    status_msg "Directories created" success

    # Generate agent ID (OpenWrt may not have uuidgen)
    AGENT_ID=$(cat /proc/sys/kernel/random/uuid 2>/dev/null || echo "openwrt-$(date +%s)")
    
    # Detect router model
    ROUTER_MODEL=$(cat /tmp/sysinfo/model 2>/dev/null || echo "unknown")
    status_msg "Router model: $ROUTER_MODEL"
    status_msg "Generated Agent ID: $AGENT_ID"

    # Create config file (using simple format for ash shell)
    cat > "$CONFIG_PATH/agent.json" << EOF
{
    "agent_id": "$AGENT_ID",
    "platform": "openwrt",
    "hostname": "$(hostname)",
    "router_model": "$ROUTER_MODEL",
    "cloud_endpoint": "$CLOUD_ENDPOINT",
    "version": "1.0.0",
    "installed_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF
    status_msg "Configuration saved" success

    # Create agent daemon script (POSIX sh compatible)
    cat > "$INSTALL_PATH/jos-agent-daemon" << 'DAEMON'
#!/bin/sh
CONFIG_PATH="/etc/jos"
LOG_PATH="/tmp/log/jos"

# Simple JSON parsing for ash shell
get_json_value() {
    grep -o "\"$1\"[[:space:]]*:[[:space:]]*\"[^\"]*\"" "$2" | sed 's/.*:.*"\([^"]*\)".*/\1/'
}

agent_id=$(get_json_value "agent_id" "$CONFIG_PATH/agent.json")
cloud_endpoint=$(get_json_value "cloud_endpoint" "$CONFIG_PATH/agent.json")

log_msg() {
    echo "$(date) $1" >> "$LOG_PATH/agent.log"
}

log_msg "JOS Agent started"

while true; do
    # Heartbeat (wget is available on OpenWrt, curl may not be)
    wget -q -O /dev/null --post-data="{\"status\":\"online\"}" \
        --header="Content-Type: application/json" \
        "$cloud_endpoint/api/agents/$agent_id/heartbeat" 2>/dev/null || log_msg "Heartbeat failed"

    # Poll for provisioned artifacts
    wget -q -O /tmp/jos_provision.json "$cloud_endpoint/api/agents/$agent_id/provision" 2>/dev/null
    
    if [ -f /tmp/jos_provision.json ] && grep -q '"artifact"' /tmp/jos_provision.json; then
        artifact_name=$(get_json_value "name" /tmp/jos_provision.json)
        log_msg "Received artifact: $artifact_name"
        # Execute with jos if available
        if command -v jos >/dev/null 2>&1; then
            jos run "$CONFIG_PATH/artifacts/$artifact_name" >> "$LOG_PATH/agent.log" 2>&1
        fi
    fi
    rm -f /tmp/jos_provision.json

    sleep 60
done
DAEMON
    chmod +x "$INSTALL_PATH/jos-agent-daemon"

    # Create init.d script
    cat > "$INIT_SCRIPT" << 'INITD'
#!/bin/sh /etc/rc.common

START=99
STOP=10
USE_PROCD=1

PROG=/usr/bin/jos-agent-daemon
NAME=jos-agent

start_service() {
    procd_open_instance
    procd_set_param command $PROG
    procd_set_param respawn
    procd_set_param stdout 1
    procd_set_param stderr 1
    procd_close_instance
}
INITD
    chmod +x "$INIT_SCRIPT"
    status_msg "init.d service created" success

    echo ""
    echo "  Agent ID: $AGENT_ID"
    echo "  Router: $ROUTER_MODEL"
    echo "  Config: $CONFIG_PATH/agent.json"
    echo "  Logs: $LOG_PATH/"
    echo ""
    echo "  Run '$INIT_SCRIPT enable' to enable at boot"
    echo "  Run '$INIT_SCRIPT start' to start now"
    echo ""
}

do_uninstall() {
    echo ""
    echo "  Uninstalling JOS Agent Service..."
    echo ""
    
    $INIT_SCRIPT stop 2>/dev/null || true
    $INIT_SCRIPT disable 2>/dev/null || true
    rm -f "$INIT_SCRIPT"
    rm -f "$INSTALL_PATH/jos-agent-daemon"
    status_msg "Service removed" success
    
    status_msg "Config files kept at $CONFIG_PATH"
    echo ""
}

do_start() {
    $INIT_SCRIPT start
    status_msg "JOS Agent started" success
}

do_stop() {
    $INIT_SCRIPT stop
    status_msg "JOS Agent stopped" success
}

do_status() {
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "  JOS Agent Service Status"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    
    if pgrep -f jos-agent-daemon >/dev/null 2>&1; then
        echo "  State: Running"
    else
        echo "  State: Stopped"
    fi
    
    if [ -f "$CONFIG_PATH/agent.json" ]; then
        agent_id=$(grep -o '"agent_id"[^,]*' "$CONFIG_PATH/agent.json" | cut -d'"' -f4)
        echo "  Agent ID: $agent_id"
        router=$(grep -o '"router_model"[^,]*' "$CONFIG_PATH/agent.json" | cut -d'"' -f4)
        echo "  Router: $router"
    fi
    echo ""
}

do_register() {
    if [ ! -f "$CONFIG_PATH/agent.json" ]; then
        status_msg "Agent not installed. Run install first." error
        exit 1
    fi

    echo ""
    echo "  Registering agent with JOS Cloud..."
    
    cloud_endpoint=$(grep -o '"cloud_endpoint"[^,]*' "$CONFIG_PATH/agent.json" | cut -d'"' -f4)
    
    # Use wget for registration
    wget -q -O /tmp/register_response.json --post-file="$CONFIG_PATH/agent.json" \
        --header="Content-Type: application/json" \
        "$cloud_endpoint/api/agents/register" 2>/dev/null
    
    if [ -f /tmp/register_response.json ] && grep -q '"cloud_id"' /tmp/register_response.json; then
        cloud_id=$(grep -o '"cloud_id"[^,]*' /tmp/register_response.json | cut -d'"' -f4)
        status_msg "Registered successfully!" success
        echo "  Cloud ID: $cloud_id"
    else
        status_msg "Registration failed" error
    fi
    rm -f /tmp/register_response.json
    echo ""
}

do_logs() {
    if [ -f "$LOG_PATH/agent.log" ]; then
        tail -50 "$LOG_PATH/agent.log"
    else
        status_msg "No logs found" warning
    fi
}

case "$1" in
    install)   do_install ;;
    uninstall) do_uninstall ;;
    start)     do_start ;;
    stop)      do_stop ;;
    status)    do_status ;;
    register)  do_register ;;
    logs)      do_logs ;;
    *)
        echo "Usage: $0 {install|uninstall|start|stop|status|register|logs}"
        exit 1
        ;;
esac
