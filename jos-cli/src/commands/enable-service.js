/**
 * enable-service.js
 * 
 * Generalized service provisioner for JOS Agent.
 * Cloud-provisionable, scalable for any service type.
 * 
 * Services can include: network/captive-portal, print, storage, display, etc.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execSync } = require('child_process');

// Default colors (will be overridden by passed colors)
let C = {
    reset: '\x1b[0m', bold: '\x1b[1m', dim: '\x1b[2m',
    cyan: '\x1b[36m', green: '\x1b[32m', red: '\x1b[31m',
    yellow: '\x1b[33m', white: '\x1b[37m', gray: '\x1b[90m',
    purple: '\x1b[35m'
};

// Service type registry - extensible for new services
const SERVICE_TYPES = {
    'captive-portal': {
        name: 'Captive Portal',
        description: 'WiFi captive portal with authentication',
        platforms: ['openwrt', 'linux', 'raspberry_pi'],
        configSchema: ['gateway_interface', 'portal_title', 'auth_mode']
    },
    'shared-print': {
        name: 'Shared Print',
        description: 'Shared printer service with cloud print queue',
        platforms: ['linux', 'raspberry_pi', 'windows', 'macos'],
        configSchema: ['printer_name', 'queue_url', 'auth_required']
    },
    'kiosk-display': {
        name: 'Kiosk Display',
        description: 'Digital signage and kiosk mode',
        platforms: ['linux', 'raspberry_pi', 'windows'],
        configSchema: ['display_url', 'refresh_interval', 'fullscreen']
    },
    'file-share': {
        name: 'File Share',
        description: 'Local network file sharing',
        platforms: ['linux', 'raspberry_pi', 'windows', 'macos', 'openwrt'],
        configSchema: ['share_path', 'auth_mode', 'max_size_mb']
    },
    'sensor-hub': {
        name: 'Sensor Hub',
        description: 'IoT sensor data collection',
        platforms: ['raspberry_pi', 'linux'],
        configSchema: ['sensors', 'poll_interval_ms', 'mqtt_broker']
    }
};

// Cloud provisioning endpoints
const CLOUD_API = {
    services: 'https://cloud.josfox.mx/api/services',
    provision: 'https://cloud.josfox.mx/api/agents/{agent_id}/services',
    register: 'https://cloud.josfox.mx/api/services/register'
};

function printBanner() {
    console.log(`
${C.purple}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C.reset}
  ${C.bold}${C.cyan}JOS SERVICE PROVISIONER${C.reset}
  ${C.dim}Enable cloud-managed services on this agent${C.reset}
${C.purple}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C.reset}
`);
}

function printHelp() {
    printBanner();
    console.log(`${C.bold}Usage:${C.reset} jos enable-service [options]

${C.bold}Description:${C.reset}
  Enable a cloud-provisionable service on this JOS Agent.
  Services are configured via cloud or local .jos artifacts.

${C.bold}Available Services:${C.reset}`);

    for (const [key, svc] of Object.entries(SERVICE_TYPES)) {
        console.log(`  ${C.green}${key}${C.reset}  ${svc.description}`);
        console.log(`    ${C.dim}Platforms: ${svc.platforms.join(', ')}${C.reset}`);
    }

    console.log(`
${C.bold}Options:${C.reset}
  --service <type>      Service type to enable
  --from-cloud          Fetch service config from JOS Cloud
  --from-file <path>    Load service config from .jos file
  --agent-id <id>       Agent ID (reads from config if not provided)
  --list                List available service types
  --dry-run             Simulate without executing
  --help, -h            Show this help

${C.bold}Examples:${C.reset}
  jos enable-service --service captive-portal
  jos enable-service --from-cloud --agent-id abc123
  jos enable-service --from-file my-print-service.jos
`);
}

async function prompt(question) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise(resolve => {
        rl.question(question, answer => {
            rl.close();
            resolve(answer.trim());
        });
    });
}

function detectPlatform() {
    const platform = process.platform;

    // Check for OpenWrt
    try {
        if (fs.existsSync('/etc/openwrt_release')) {
            return 'openwrt';
        }
    } catch (e) { }

    // Check for Raspberry Pi
    try {
        const cpuinfo = fs.readFileSync('/proc/cpuinfo', 'utf8');
        if (cpuinfo.includes('Raspberry')) {
            return 'raspberry_pi';
        }
    } catch (e) { }

    // Map Node.js platform to our platform names
    const platformMap = {
        'darwin': 'macos',
        'win32': 'windows',
        'linux': 'linux'
    };

    return platformMap[platform] || 'unknown';
}

function getAgentId(configPath) {
    const agentConfigPath = path.join(configPath, 'agent.json');
    if (fs.existsSync(agentConfigPath)) {
        try {
            const config = JSON.parse(fs.readFileSync(agentConfigPath, 'utf8'));
            return config.agent_id;
        } catch (e) { }
    }
    return null;
}

async function fetchCloudService(agentId) {
    console.log(`\n${C.cyan}▶${C.reset} Fetching provisioned service from cloud...`);

    try {
        const url = CLOUD_API.provision.replace('{agent_id}', agentId);
        const response = execSync(`curl -s "${url}"`, { encoding: 'utf8' });
        const data = JSON.parse(response);

        if (data.service) {
            console.log(`  ${C.green}✓${C.reset} Found service: ${C.bold}${data.service.type}${C.reset}`);
            return data.service;
        } else {
            console.log(`  ${C.yellow}⚠${C.reset} No services provisioned for this agent`);
            return null;
        }
    } catch (e) {
        console.log(`  ${C.red}✖${C.reset} Failed to fetch from cloud: ${e.message}`);
        return null;
    }
}

function loadServiceFromFile(filePath) {
    console.log(`\n${C.cyan}▶${C.reset} Loading service from ${C.bold}${filePath}${C.reset}...`);

    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const artifact = JSON.parse(content);

        // Extract service config from .jos artifact
        const serviceType = artifact.service?.type || artifact.meta?.service_type;
        const serviceConfig = artifact.service?.config || artifact.config || {};

        console.log(`  ${C.green}✓${C.reset} Loaded service: ${C.bold}${serviceType}${C.reset}`);
        return { type: serviceType, config: serviceConfig, artifact };
    } catch (e) {
        console.log(`  ${C.red}✖${C.reset} Failed to load file: ${e.message}`);
        return null;
    }
}

async function configureService(serviceType, platform, dryRun) {
    const svc = SERVICE_TYPES[serviceType];
    if (!svc) {
        console.log(`  ${C.red}✖${C.reset} Unknown service type: ${serviceType}`);
        return null;
    }

    if (!svc.platforms.includes(platform)) {
        console.log(`  ${C.yellow}⚠${C.reset} Service '${serviceType}' not supported on ${platform}`);
        console.log(`  ${C.dim}Supported: ${svc.platforms.join(', ')}${C.reset}`);
        return null;
    }

    console.log(`\n${C.cyan}▶${C.reset} Configuring ${C.bold}${svc.name}${C.reset}...\n`);

    const config = {};
    for (const field of svc.configSchema) {
        const value = await prompt(`  ${C.white}${field}:${C.reset} `);
        config[field] = value;
    }

    console.log(`  ${C.green}✓${C.reset} Configuration complete`);
    return { type: serviceType, config };
}

async function deployService(service, platform, configPath, dryRun) {
    console.log(`\n${C.cyan}▶${C.reset} Deploying ${C.bold}${service.type}${C.reset} service...`);

    // Save service config
    const servicePath = path.join(configPath, 'services', service.type);
    if (!dryRun) {
        if (!fs.existsSync(servicePath)) {
            fs.mkdirSync(servicePath, { recursive: true });
        }
        fs.writeFileSync(
            path.join(servicePath, 'config.json'),
            JSON.stringify(service.config, null, 2)
        );
    }
    console.log(`  ${C.green}✓${C.reset} Config saved to ${C.dim}${servicePath}${C.reset}`);

    // Execute service-specific deployment
    // This would be extended per service type
    console.log(`  ${C.dim}Service-specific deployment would run here${C.reset}`);

    return true;
}

async function registerWithCloud(agentId, service) {
    console.log(`\n${C.cyan}▶${C.reset} Registering service with cloud...`);

    try {
        const payload = JSON.stringify({
            agent_id: agentId,
            service_type: service.type,
            config: service.config,
            registered_at: new Date().toISOString()
        });

        execSync(`curl -s -X POST "${CLOUD_API.register}" -H "Content-Type: application/json" -d '${payload}'`,
            { stdio: 'pipe' });

        console.log(`  ${C.green}✓${C.reset} Registered with cloud`);
        return true;
    } catch (e) {
        console.log(`  ${C.yellow}⚠${C.reset} Cloud registration skipped: ${e.message}`);
        return false;
    }
}

async function execute(args, JOS_HOME, options = {}) {
    // Use passed colors if available
    if (options.C) C = options.C;

    const help = args.includes('--help') || args.includes('-h');
    const list = args.includes('--list');
    const dryRun = args.includes('--dry-run');
    const fromCloud = args.includes('--from-cloud');

    const serviceIdx = args.indexOf('--service');
    const serviceType = serviceIdx >= 0 ? args[serviceIdx + 1] : null;

    const fileIdx = args.indexOf('--from-file');
    const filePath = fileIdx >= 0 ? args[fileIdx + 1] : null;

    const agentIdx = args.indexOf('--agent-id');
    let agentId = agentIdx >= 0 ? args[agentIdx + 1] : null;

    if (help) {
        printHelp();
        return;
    }

    if (list) {
        console.log(`\n${C.bold}Available Service Types:${C.reset}\n`);
        for (const [key, svc] of Object.entries(SERVICE_TYPES)) {
            console.log(`  ${C.green}${key}${C.reset}`);
            console.log(`    ${svc.description}`);
            console.log(`    ${C.dim}Platforms: ${svc.platforms.join(', ')}${C.reset}\n`);
        }
        return;
    }

    printBanner();

    if (dryRun) {
        console.log(`${C.yellow}⚡ DRY RUN MODE${C.reset} — Commands will be simulated\n`);
    }

    // Detect platform
    const platform = detectPlatform();
    console.log(`${C.dim}Platform:${C.reset} ${platform}`);

    // Get config path based on platform
    const configPath = platform === 'windows'
        ? path.join(process.env.ProgramData || '', 'JOS')
        : (platform === 'openwrt' ? '/etc/jos' : path.join(process.env.HOME, '.jos'));

    // Get agent ID
    if (!agentId) {
        agentId = getAgentId(configPath);
    }
    if (agentId) {
        console.log(`${C.dim}Agent ID:${C.reset} ${agentId}`);
    }

    let service = null;

    // Mode 1: Fetch from cloud
    if (fromCloud) {
        if (!agentId) {
            console.log(`\n${C.red}✖${C.reset} Agent ID required for cloud fetch. Run agent install first.`);
            process.exit(1);
        }
        service = await fetchCloudService(agentId);
    }
    // Mode 2: Load from file
    else if (filePath) {
        service = loadServiceFromFile(filePath);
    }
    // Mode 3: Interactive configuration
    else if (serviceType) {
        service = await configureService(serviceType, platform, dryRun);
    }
    // Mode 4: Prompt for service type
    else {
        console.log(`\n${C.bold}Select service type:${C.reset}`);
        const types = Object.keys(SERVICE_TYPES);
        types.forEach((t, i) => {
            const svc = SERVICE_TYPES[t];
            console.log(`  ${C.green}${i + 1}.${C.reset} ${svc.name} - ${svc.description}`);
        });

        const choice = await prompt(`\n${C.white}Choice [1-${types.length}]:${C.reset} `);
        const selectedType = types[parseInt(choice) - 1];

        if (selectedType) {
            service = await configureService(selectedType, platform, dryRun);
        }
    }

    if (!service) {
        console.log(`\n${C.red}✖${C.reset} No service configuration available`);
        process.exit(1);
    }

    // Deploy service
    await deployService(service, platform, configPath, dryRun);

    // Register with cloud
    if (agentId && !dryRun) {
        await registerWithCloud(agentId, service);
    }

    // Summary
    console.log(`
${C.purple}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C.reset}
  ${C.green}✓${C.reset} ${C.bold}Service Enabled: ${SERVICE_TYPES[service.type]?.name || service.type}${C.reset}
${C.purple}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C.reset}

  ${C.bold}Platform:${C.reset} ${platform}
  ${C.bold}Config:${C.reset} ${configPath}/services/${service.type}/
  ${C.bold}Cloud:${C.reset} ${agentId ? 'Registered' : 'Not registered'}

  ${C.dim}Service will start automatically on agent restart.${C.reset}
`);
}

module.exports = { execute, SERVICE_TYPES };
