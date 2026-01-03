#!/bin/bash
#
# JOS Agent Service Installer for macOS
# Installs agent as launchd service
#
# Usage:
#   ./install-agent.sh install
#   ./install-agent.sh uninstall
#   ./install-agent.sh start|stop|status|register|logs

set -e

CLOUD_ENDPOINT="${CLOUD_ENDPOINT:-https://cloud.josfox.mx}"
INSTALL_PATH="/usr/local/bin"
CONFIG_PATH="$HOME/Library/Application Support/JOS"
LOG_PATH="$HOME/Library/Logs/JOS"
PLIST_PATH="$HOME/Library/LaunchAgents/mx.jos.agent.plist"
SERVICE_LABEL="mx.jos.agent"

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
    echo -e "${CYAN}  JOS Agent Service - macOS Installer${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

    # Create directories
    status_msg "Creating directories..."
    mkdir -p "$CONFIG_PATH"
    mkdir -p "$LOG_PATH"
    mkdir -p "$CONFIG_PATH/artifacts"
    status_msg "Directories created" success

    # Generate agent ID
    AGENT_ID=$(uuidgen)
    status_msg "Generated Agent ID: $AGENT_ID"

    # Create config file
    cat > "$CONFIG_PATH/agent.json" << EOF
{
    "agent_id": "$AGENT_ID",
    "platform": "macos",
    "hostname": "$(hostname)",
    "cloud_endpoint": "$CLOUD_ENDPOINT",
    "version": "1.0.0",
    "installed_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF
    status_msg "Configuration saved" success

    # Create agent daemon script
    cat > "$INSTALL_PATH/jos-agent-daemon" << 'DAEMON'
#!/bin/bash
CONFIG_PATH="$HOME/Library/Application Support/JOS"
LOG_PATH="$HOME/Library/Logs/JOS"

config=$(cat "$CONFIG_PATH/agent.json")
agent_id=$(echo "$config" | jq -r '.agent_id')
cloud_endpoint=$(echo "$config" | jq -r '.cloud_endpoint')

while true; do
    # Heartbeat
    curl -s -X POST "$cloud_endpoint/api/agents/$agent_id/heartbeat" \
        -H "Content-Type: application/json" \
        -d "{\"status\":\"online\",\"timestamp\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}" \
        > /dev/null 2>&1 || true

    # Poll for provisioned artifacts
    provision=$(curl -s "$cloud_endpoint/api/agents/$agent_id/provision" 2>/dev/null || echo "{}")
    
    if echo "$provision" | jq -e '.artifact' > /dev/null 2>&1; then
        artifact_name=$(echo "$provision" | jq -r '.artifact.name')
        echo "$provision" | jq -r '.artifact.content' > "$CONFIG_PATH/artifacts/$artifact_name"
        jos run "$CONFIG_PATH/artifacts/$artifact_name" >> "$LOG_PATH/agent.log" 2>&1
    fi

    sleep 60
done
DAEMON
    chmod +x "$INSTALL_PATH/jos-agent-daemon"

    # Create launchd plist
    mkdir -p "$(dirname "$PLIST_PATH")"
    cat > "$PLIST_PATH" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>$SERVICE_LABEL</string>
    <key>ProgramArguments</key>
    <array>
        <string>$INSTALL_PATH/jos-agent-daemon</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardOutPath</key>
    <string>$LOG_PATH/agent.log</string>
    <key>StandardErrorPath</key>
    <string>$LOG_PATH/agent-error.log</string>
</dict>
</plist>
EOF
    status_msg "launchd service created" success

    echo -e "\n  ${GREEN}Agent ID: $AGENT_ID${NC}"
    echo "  Config: $CONFIG_PATH/agent.json"
    echo "  Logs: $LOG_PATH/"
    echo -e "\n  Run './install-agent.sh register' to connect to JOS Cloud\n"
}

do_uninstall() {
    echo -e "\n  Uninstalling JOS Agent Service...\n"
    
    launchctl unload "$PLIST_PATH" 2>/dev/null || true
    rm -f "$PLIST_PATH"
    status_msg "launchd service removed" success
    
    # Keep config
    status_msg "Config files kept at $CONFIG_PATH"
    echo ""
}

do_start() {
    launchctl load "$PLIST_PATH"
    status_msg "JOS Agent started" success
}

do_stop() {
    launchctl unload "$PLIST_PATH"
    status_msg "JOS Agent stopped" success
}

do_status() {
    echo -e "\n${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${CYAN}  JOS Agent Service Status${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
    
    if launchctl list | grep -q "$SERVICE_LABEL"; then
        echo "  State: Running"
    else
        echo "  State: Stopped"
    fi
    
    if [ -f "$CONFIG_PATH/agent.json" ]; then
        agent_id=$(cat "$CONFIG_PATH/agent.json" | grep -o '"agent_id"[^,]*' | cut -d'"' -f4)
        cloud=$(cat "$CONFIG_PATH/agent.json" | grep -o '"cloud_endpoint"[^,]*' | cut -d'"' -f4)
        echo "  Agent ID: $agent_id"
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
    agent_id=$(echo "$config" | jq -r '.agent_id')
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
