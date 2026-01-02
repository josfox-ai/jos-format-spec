/**
 * JOS AGENT Command - Resilient daemon service management
 * Install, manage, and monitor .jos-driven agents
 * Format version v0.0.7 — Specification maturity v0.1.0 (Alpha)
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');
const crypto = require('crypto');
const os = require('os');

// AURORA colors
const C = {
    reset: '\x1b[0m', bold: '\x1b[1m', dim: '\x1b[2m',
    purple: '\x1b[38;5;135m', cyan: '\x1b[38;5;51m',
    green: '\x1b[38;5;78m', red: '\x1b[38;5;196m',
    yellow: '\x1b[38;5;220m', white: '\x1b[38;5;255m',
    gray: '\x1b[38;5;245m', blue: '\x1b[38;5;39m'
};

const AGENTS_DIR = path.join(process.env.HOME, '.jos', 'agents');
const LOGS_DIR = path.join(process.env.HOME, '.jos', 'logs');

// Detect init system
function detectInitSystem() {
    try {
        // Check for systemd
        if (fs.existsSync('/run/systemd/system')) {
            return 'systemd';
        }
        // Check for procd (OpenWrt)
        if (fs.existsSync('/sbin/procd')) {
            return 'procd';
        }
        // Check for launchd (macOS)
        if (process.platform === 'darwin') {
            return 'launchd';
        }
        // Fallback
        return 'generic';
    } catch {
        return 'generic';
    }
}

// Generate service files for different init systems
function generateServiceFile(config, initSystem) {
    const { name, artifactPath, hub, user, envVars } = config;
    const josPath = process.argv[1];
    const nodePath = process.execPath;

    switch (initSystem) {
        case 'systemd':
            return `[Unit]
Description=JOS Agent: ${name}
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=${user || 'root'}
WorkingDirectory=${path.dirname(artifactPath)}
ExecStart=${nodePath} ${josPath} agent run ${artifactPath} --hub ${hub}
Restart=always
RestartSec=10
${envVars.map(e => `Environment="${e}"`).join('\n')}

[Install]
WantedBy=multi-user.target
`;

        case 'procd':
            return `#!/bin/sh /etc/rc.common
# JOS Agent: ${name}
START=95
STOP=10
USE_PROCD=1

start_service() {
    procd_open_instance
    procd_set_param command ${nodePath} ${josPath} agent run ${artifactPath} --hub ${hub}
    procd_set_param respawn
    procd_set_param stdout 1
    procd_set_param stderr 1
    procd_close_instance
}
`;

        case 'launchd':
            return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>ai.josfox.agent.${name}</string>
    <key>ProgramArguments</key>
    <array>
        <string>${nodePath}</string>
        <string>${josPath}</string>
        <string>agent</string>
        <string>run</string>
        <string>${artifactPath}</string>
        <string>--hub</string>
        <string>${hub}</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardOutPath</key>
    <string>${LOGS_DIR}/${name}.log</string>
    <key>StandardErrorPath</key>
    <string>${LOGS_DIR}/${name}.error.log</string>
</dict>
</plist>
`;

        default:
            return null;
    }
}

// Install agent
async function installAgent(args, home) {
    const artifactArg = args[0];
    if (!artifactArg) {
        console.log(`${C.red}✖ Usage: jos agent install <artifact.jos> --hub <url>${C.reset}`);
        return;
    }

    const hubIdx = args.indexOf('--hub');
    const hub = hubIdx !== -1 ? args[hubIdx + 1] : null;

    const nameIdx = args.indexOf('--name');
    const userIdx = args.indexOf('--user');

    let artifactPath = path.resolve(artifactArg.endsWith('.jos') ? artifactArg : artifactArg + '.jos');
    if (!fs.existsSync(artifactPath)) {
        console.log(`${C.red}✖ Artifact not found: ${artifactPath}${C.reset}`);
        return;
    }

    const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
    const name = nameIdx !== -1 ? args[nameIdx + 1] : (artifact.meta?.name || path.basename(artifactPath, '.jos'));
    const user = userIdx !== -1 ? args[userIdx + 1] : 'root';

    // Collect env vars
    const envVars = [];
    args.forEach((arg, i) => {
        if (arg === '--env' && args[i + 1]) {
            envVars.push(args[i + 1]);
        }
    });

    console.log(`\n${C.purple}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C.reset}`);
    console.log(`${C.cyan}${C.bold}JOS AGENT INSTALL${C.reset}`);
    console.log(`${C.purple}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C.reset}\n`);

    const initSystem = detectInitSystem();
    console.log(`${C.cyan}📦 Artifact:${C.reset} ${artifact.meta?.name || path.basename(artifactPath)}`);
    console.log(`${C.cyan}🏷️  Name:${C.reset} ${name}`);
    console.log(`${C.cyan}🔌 Hub:${C.reset} ${hub || 'not configured'}`);
    console.log(`${C.cyan}⚙️  Init:${C.reset} ${initSystem}`);
    console.log(`${C.cyan}👤 User:${C.reset} ${user}`);
    console.log('');

    // Ensure directories exist
    if (!fs.existsSync(AGENTS_DIR)) fs.mkdirSync(AGENTS_DIR, { recursive: true });
    if (!fs.existsSync(LOGS_DIR)) fs.mkdirSync(LOGS_DIR, { recursive: true });

    // Save agent config
    const agentConfig = {
        name,
        artifactPath,
        hub,
        user,
        envVars,
        initSystem,
        installedAt: new Date().toISOString()
    };
    fs.writeFileSync(path.join(AGENTS_DIR, `${name}.json`), JSON.stringify(agentConfig, null, 2));

    // Generate and install service
    const serviceContent = generateServiceFile(agentConfig, initSystem);

    if (!serviceContent) {
        console.log(`${C.yellow}⚠ Generic init system - manual service setup required${C.reset}`);
        console.log(`${C.gray}  Run: jos agent run ${artifactPath} --hub ${hub}${C.reset}`);
        return;
    }

    try {
        switch (initSystem) {
            case 'systemd': {
                const servicePath = `/etc/systemd/system/jos-agent-${name}.service`;
                console.log(`${C.yellow}⏳ Installing systemd service...${C.reset}`);
                fs.writeFileSync(servicePath, serviceContent);
                execSync('systemctl daemon-reload');
                execSync(`systemctl enable jos-agent-${name}`);
                execSync(`systemctl start jos-agent-${name}`);
                console.log(`${C.green}✓ Service installed: ${servicePath}${C.reset}`);
                break;
            }
            case 'procd': {
                const servicePath = `/etc/init.d/jos-agent-${name}`;
                console.log(`${C.yellow}⏳ Installing procd service...${C.reset}`);
                fs.writeFileSync(servicePath, serviceContent);
                fs.chmodSync(servicePath, '755');
                execSync(`${servicePath} enable`);
                execSync(`${servicePath} start`);
                console.log(`${C.green}✓ Service installed: ${servicePath}${C.reset}`);
                break;
            }
            case 'launchd': {
                const plistPath = path.join(process.env.HOME, 'Library', 'LaunchAgents', `ai.josfox.agent.${name}.plist`);
                console.log(`${C.yellow}⏳ Installing launchd service...${C.reset}`);
                fs.mkdirSync(path.dirname(plistPath), { recursive: true });
                fs.writeFileSync(plistPath, serviceContent);
                execSync(`launchctl load ${plistPath}`);
                console.log(`${C.green}✓ Service installed: ${plistPath}${C.reset}`);
                break;
            }
        }
    } catch (e) {
        console.log(`${C.red}✖ Failed to install service: ${e.message}${C.reset}`);
        console.log(`${C.gray}  You may need sudo privileges${C.reset}`);
        return;
    }

    console.log(`\n${C.green}${C.bold}✓ Agent installed successfully${C.reset}`);
    console.log(`${C.gray}  View status: jos agent status ${name}${C.reset}`);
    console.log(`${C.gray}  View logs: jos agent logs ${name}${C.reset}\n`);
}

// Uninstall agent
async function uninstallAgent(args, home) {
    const name = args[0];
    if (!name) {
        console.log(`${C.red}✖ Usage: jos agent uninstall <name>${C.reset}`);
        return;
    }

    const configPath = path.join(AGENTS_DIR, `${name}.json`);
    if (!fs.existsSync(configPath)) {
        console.log(`${C.red}✖ Agent not found: ${name}${C.reset}`);
        return;
    }

    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

    console.log(`\n${C.yellow}⏳ Uninstalling agent: ${name}...${C.reset}`);

    try {
        switch (config.initSystem) {
            case 'systemd':
                execSync(`systemctl stop jos-agent-${name} 2>/dev/null || true`);
                execSync(`systemctl disable jos-agent-${name} 2>/dev/null || true`);
                fs.unlinkSync(`/etc/systemd/system/jos-agent-${name}.service`);
                execSync('systemctl daemon-reload');
                break;
            case 'procd':
                execSync(`/etc/init.d/jos-agent-${name} stop 2>/dev/null || true`);
                execSync(`/etc/init.d/jos-agent-${name} disable 2>/dev/null || true`);
                fs.unlinkSync(`/etc/init.d/jos-agent-${name}`);
                break;
            case 'launchd':
                const plistPath = path.join(process.env.HOME, 'Library', 'LaunchAgents', `ai.josfox.agent.${name}.plist`);
                execSync(`launchctl unload ${plistPath} 2>/dev/null || true`);
                fs.unlinkSync(plistPath);
                break;
        }
    } catch (e) {
        console.log(`${C.yellow}⚠ Service removal warning: ${e.message}${C.reset}`);
    }

    fs.unlinkSync(configPath);
    console.log(`${C.green}✓ Agent uninstalled: ${name}${C.reset}\n`);
}

// Show agent status
async function showStatus(args, home) {
    const name = args[0];

    console.log(`\n${C.purple}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C.reset}`);
    console.log(`${C.cyan}${C.bold}JOS AGENT STATUS${C.reset}`);
    console.log(`${C.purple}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C.reset}\n`);

    if (name) {
        const configPath = path.join(AGENTS_DIR, `${name}.json`);
        if (!fs.existsSync(configPath)) {
            console.log(`${C.red}✖ Agent not found: ${name}${C.reset}`);
            return;
        }
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

        let status = 'unknown';
        try {
            switch (config.initSystem) {
                case 'systemd':
                    execSync(`systemctl is-active jos-agent-${name}`, { stdio: 'pipe' });
                    status = 'running';
                    break;
                case 'procd':
                    execSync(`/etc/init.d/jos-agent-${name} running`, { stdio: 'pipe' });
                    status = 'running';
                    break;
                case 'launchd':
                    const result = execSync(`launchctl list | grep ai.josfox.agent.${name}`, { stdio: 'pipe' });
                    status = result.toString().includes(name) ? 'running' : 'stopped';
                    break;
            }
        } catch {
            status = 'stopped';
        }

        const statusColor = status === 'running' ? C.green : C.red;
        console.log(`${C.cyan}🏷️  Name:${C.reset} ${config.name}`);
        console.log(`${C.cyan}📊 Status:${C.reset} ${statusColor}${status}${C.reset}`);
        console.log(`${C.cyan}📦 Artifact:${C.reset} ${config.artifactPath}`);
        console.log(`${C.cyan}🔌 Hub:${C.reset} ${config.hub || 'not configured'}`);
        console.log(`${C.cyan}⚙️  Init:${C.reset} ${config.initSystem}`);
        console.log(`${C.cyan}📅 Installed:${C.reset} ${config.installedAt}`);
    } else {
        await listAgents(args, home);
    }
    console.log('');
}

// List all agents
async function listAgents(args, home) {
    if (!fs.existsSync(AGENTS_DIR)) {
        console.log(`${C.gray}No agents installed${C.reset}`);
        return;
    }

    const agents = fs.readdirSync(AGENTS_DIR).filter(f => f.endsWith('.json'));

    if (agents.length === 0) {
        console.log(`${C.gray}No agents installed${C.reset}`);
        return;
    }

    console.log(`${C.bold}Installed Agents:${C.reset}\n`);

    for (const file of agents) {
        const config = JSON.parse(fs.readFileSync(path.join(AGENTS_DIR, file), 'utf8'));
        let status = 'stopped';

        try {
            switch (config.initSystem) {
                case 'systemd':
                    execSync(`systemctl is-active jos-agent-${config.name}`, { stdio: 'pipe' });
                    status = 'running';
                    break;
                case 'launchd':
                    const result = execSync(`launchctl list 2>/dev/null | grep ai.josfox.agent.${config.name}`, { stdio: 'pipe' });
                    status = result.toString().includes(config.name) ? 'running' : 'stopped';
                    break;
            }
        } catch {
            status = 'stopped';
        }

        const statusIcon = status === 'running' ? `${C.green}●${C.reset}` : `${C.red}○${C.reset}`;
        console.log(`  ${statusIcon} ${C.bold}${config.name}${C.reset} ${C.gray}(${config.initSystem})${C.reset}`);
        console.log(`    ${C.dim}${config.hub || 'no hub'}${C.reset}`);
    }
}

// View agent logs
async function viewLogs(args, home) {
    const name = args[0];
    if (!name) {
        console.log(`${C.red}✖ Usage: jos agent logs <name> [--follow]${C.reset}`);
        return;
    }

    const configPath = path.join(AGENTS_DIR, `${name}.json`);
    if (!fs.existsSync(configPath)) {
        console.log(`${C.red}✖ Agent not found: ${name}${C.reset}`);
        return;
    }

    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    const follow = args.includes('--follow') || args.includes('-f');

    try {
        switch (config.initSystem) {
            case 'systemd':
                const journalCmd = follow ?
                    `journalctl -u jos-agent-${name} -f` :
                    `journalctl -u jos-agent-${name} -n 50`;
                execSync(journalCmd, { stdio: 'inherit' });
                break;
            case 'launchd': {
                const logPath = path.join(LOGS_DIR, `${name}.log`);
                if (fs.existsSync(logPath)) {
                    const tailCmd = follow ? `tail -f ${logPath}` : `tail -50 ${logPath}`;
                    execSync(tailCmd, { stdio: 'inherit' });
                } else {
                    console.log(`${C.yellow}No logs found at ${logPath}${C.reset}`);
                }
                break;
            }
            default:
                console.log(`${C.yellow}Log viewing not supported for ${config.initSystem}${C.reset}`);
        }
    } catch (e) {
        console.log(`${C.red}✖ Failed to read logs: ${e.message}${C.reset}`);
    }
}

// Agent runtime (for running as daemon)
async function runAgent(args, home) {
    const artifactArg = args[0];
    const hubIdx = args.indexOf('--hub');
    const hub = hubIdx !== -1 ? args[hubIdx + 1] : null;

    if (!artifactArg) {
        console.log(`${C.red}✖ Usage: jos agent run <artifact.jos> --hub <url>${C.reset}`);
        return;
    }

    let artifactPath = path.resolve(artifactArg.endsWith('.jos') ? artifactArg : artifactArg + '.jos');

    console.log(`[${new Date().toISOString()}] Agent starting: ${path.basename(artifactPath)}`);
    console.log(`[${new Date().toISOString()}] Hub: ${hub || 'offline mode'}`);

    // Agent main loop
    const runLoop = async () => {
        while (true) {
            try {
                // 1. Check connectivity (if hub configured)
                if (hub) {
                    console.log(`[${new Date().toISOString()}] Heartbeat → ${hub}`);
                    // TODO: Implement actual hub communication
                }

                // 2. Load and validate artifact
                if (fs.existsSync(artifactPath)) {
                    const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
                    console.log(`[${new Date().toISOString()}] Config version: ${artifact.meta?.version || 'unknown'}`);
                }

                // 3. TODO: Fetch remote config if hub configured
                // 4. TODO: Verify signature
                // 5. TODO: Apply config with rollback
                // 6. TODO: Report status

            } catch (e) {
                console.error(`[${new Date().toISOString()}] Error: ${e.message}`);
            }

            // Sleep 60 seconds
            await new Promise(r => setTimeout(r, 60000));
        }
    };

    runLoop();
}

exports.execute = async (args, home) => {
    const subcommand = args[0];
    const subArgs = args.slice(1);

    if (args.includes('--help') || !subcommand) {
        console.log(`
${C.purple}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C.reset}
${C.bold}JOS AGENT${C.reset} // Resilient daemon service management
${C.purple}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C.reset}

${C.bold}Usage:${C.reset}
  jos agent <subcommand> [options]

${C.bold}Subcommands:${C.reset}
  install <artifact.jos>   Install as persistent daemon
  uninstall <name>         Remove installed agent
  status [name]            Show agent status
  logs <name>              View agent logs
  list                     List all installed agents
  run <artifact.jos>       Run agent (daemon mode)

${C.bold}Install Options:${C.reset}
  --hub <url>              Remote hub endpoint
  --name <service>         Service name (default: artifact name)
  --user <user>            Run as user (default: root)
  --env <key=value>        Environment variables

${C.bold}Examples:${C.reset}
  jos agent install my-service.jos --hub https://hub.example.com
  jos agent status my-service
  jos agent logs my-service --follow
  jos agent uninstall my-service
`);
        return;
    }

    switch (subcommand) {
        case 'install':
            await installAgent(subArgs, home);
            break;
        case 'uninstall':
            await uninstallAgent(subArgs, home);
            break;
        case 'status':
            await showStatus(subArgs, home);
            break;
        case 'logs':
            await viewLogs(subArgs, home);
            break;
        case 'list':
            await listAgents(subArgs, home);
            break;
        case 'run':
            await runAgent(subArgs, home);
            break;
        default:
            console.log(`${C.red}✖ Unknown subcommand: ${subcommand}${C.reset}`);
            console.log(`${C.gray}Use --help for usage information${C.reset}`);
    }
};
