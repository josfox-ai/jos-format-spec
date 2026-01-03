#!/bin/bash
#
# JOS Agent Service Installer for Linux (systemd)
# Also works on Raspberry Pi with GPIO support
#
# Usage:
#   sudo ./install-agent.sh install
#   ./install-agent.sh start|stop|status|register|logs

set -e

CLOUD_ENDPOINT="${CLOUD_ENDPOINT:-https://cloud.josfox.mx}"
INSTALL_PATH="/usr/local/bin"
CONFIG_PATH="/etc/jos"
LOG_PATH="/var/log/jos"
SERVICE_FILE="/etc/systemd/system/jos-agent.service"

# Detect if running on Raspberry Pi
IS_PI=false
if grep -q "Raspberry" /proc/cpuinfo 2>/dev/null; then
    IS_PI=true
fi

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

status_msg() {
    local icon="→"
    case $2 in
        success) icon="✓"; color=$GREEN ;;
        error) icon="✖"; color=$RED ;;
        warning) icon="⚠"; color=$YELLOW ;;
        *) color=$NC ;;
    esac
    echo -e "  ${color}${icon}${NC} $1"
}

do_install() {
    echo -e "\n${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    if [ "$IS_PI" = true ]; then
        echo -e "${CYAN}  JOS Agent Service - Raspberry Pi Installer${NC}"
    else
        echo -e "${CYAN}  JOS Agent Service - Linux Installer${NC}"
    fi
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

    # Check root
    if [ "$EUID" -ne 0 ]; then
        status_msg "Please run as root (sudo)" error
        exit 1
    fi

    # Create directories
    status_msg "Creating directories..."
    mkdir -p "$CONFIG_PATH"
    mkdir -p "$LOG_PATH"
    mkdir -p "$CONFIG_PATH/artifacts"
    status_msg "Directories created" success

    # Generate agent ID
    AGENT_ID=$(cat /proc/sys/kernel/random/uuid)
    PLATFORM="linux"
    [ "$IS_PI" = true ] && PLATFORM="raspberry_pi"
    status_msg "Generated Agent ID: $AGENT_ID"

    # Create config file
    cat > "$CONFIG_PATH/agent.json" << EOF
{
    "agent_id": "$AGENT_ID",
    "platform": "$PLATFORM",
    "hostname": "$(hostname)",
    "cloud_endpoint": "$CLOUD_ENDPOINT",
    "version": "1.0.0",
    "gpio_enabled": $IS_PI,
    "installed_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF
    status_msg "Configuration saved" success

    # Create agent daemon script
    cat > "$INSTALL_PATH/jos-agent-daemon" << 'DAEMON'
#!/bin/bash
CONFIG_PATH="/etc/jos"
LOG_PATH="/var/log/jos"

config=$(cat "$CONFIG_PATH/agent.json")
agent_id=$(echo "$config" | jq -r '.agent_id')
cloud_endpoint=$(echo "$config" | jq -r '.cloud_endpoint')

log() {
    echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) $1" >> "$LOG_PATH/agent.log"
}

log "JOS Agent started"

while true; do
    # Heartbeat
    curl -s -X POST "$cloud_endpoint/api/agents/$agent_id/heartbeat" \
        -H "Content-Type: application/json" \
        -d "{\"status\":\"online\",\"timestamp\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}" \
        > /dev/null 2>&1 || log "Heartbeat failed"

    # Poll for provisioned artifacts
    provision=$(curl -s "$cloud_endpoint/api/agents/$agent_id/provision" 2>/dev/null || echo "{}")
    
    if echo "$provision" | jq -e '.artifact' > /dev/null 2>&1; then
        artifact_name=$(echo "$provision" | jq -r '.artifact.name')
        log "Received artifact: $artifact_name"
        echo "$provision" | jq -r '.artifact.content' > "$CONFIG_PATH/artifacts/$artifact_name"
        jos run "$CONFIG_PATH/artifacts/$artifact_name" >> "$LOG_PATH/agent.log" 2>&1
    fi

    sleep 60
done
DAEMON
    chmod +x "$INSTALL_PATH/jos-agent-daemon"

    # Create systemd service
    cat > "$SERVICE_FILE" << EOF
[Unit]
Description=JOS Agent Service
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
ExecStart=$INSTALL_PATH/jos-agent-daemon
Restart=always
RestartSec=10
StandardOutput=append:$LOG_PATH/agent.log
StandardError=append:$LOG_PATH/agent-error.log

[Install]
WantedBy=multi-user.target
EOF

    systemctl daemon-reload
    systemctl enable jos-agent
    status_msg "systemd service created" success

    echo -e "\n  ${GREEN}Agent ID: $AGENT_ID${NC}"
    echo "  Platform: $PLATFORM"
    echo "  Config: $CONFIG_PATH/agent.json"
    echo "  Logs: $LOG_PATH/"
    [ "$IS_PI" = true ] && echo "  GPIO: Enabled"
    echo -e "\n  Run 'sudo ./install-agent.sh register' to connect to JOS Cloud"
    echo -e "  Run 'sudo systemctl start jos-agent' to start the service\n"
}

do_uninstall() {
    echo -e "\n  Uninstalling JOS Agent Service...\n"
    
    systemctl stop jos-agent 2>/dev/null || true
    systemctl disable jos-agent 2>/dev/null || true
    rm -f "$SERVICE_FILE"
    systemctl daemon-reload
    status_msg "systemd service removed" success
    
    status_msg "Config files kept at $CONFIG_PATH"
    echo ""
}

do_start() {
    systemctl start jos-agent
    status_msg "JOS Agent started" success
}

do_stop() {
    systemctl stop jos-agent
    status_msg "JOS Agent stopped" success
}

do_status() {
    echo -e "\n${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${CYAN}  JOS Agent Service Status${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
    
    systemctl status jos-agent --no-pager 2>/dev/null || echo "  Service not installed"
    
    if [ -f "$CONFIG_PATH/agent.json" ]; then
        echo ""
        agent_id=$(cat "$CONFIG_PATH/agent.json" | jq -r '.agent_id')
        cloud=$(cat "$CONFIG_PATH/agent.json" | jq -r '.cloud_endpoint')
        platform=$(cat "$CONFIG_PATH/agent.json" | jq -r '.platform')
        echo "  Agent ID: $agent_id"
        echo "  Platform: $platform"
        echo "  Cloud: $cloud"
    fi
    echo ""
}

do_register() {
    if [ ! -f "$CONFIG_PATH/agent.json" ]; then
        status_msg "Agent not installed. Run install first." error
        exit 1
    fi

    echo -e "\n  Registering agent with JOS Cloud..."
    
    config=$(cat "$CONFIG_PATH/agent.json")
    cloud_endpoint=$(echo "$config" | jq -r '.cloud_endpoint')
    
    response=$(curl -s -X POST "$cloud_endpoint/api/agents/register" \
        -H "Content-Type: application/json" \
        -d "$config")
    
    if echo "$response" | jq -e '.cloud_id' > /dev/null 2>&1; then
        cloud_id=$(echo "$response" | jq -r '.cloud_id')
        status_msg "Registered successfully!" success
        echo -e "  ${GREEN}Cloud ID: $cloud_id${NC}"
    else
        status_msg "Registration failed: $response" error
    fi
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
