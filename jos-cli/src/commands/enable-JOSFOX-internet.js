/**
 * enable-JOSFOX-internet.js
 * 
 * Transform supported WiFi routers into monetizable captive portals.
 * Supports GL.iNet routers (Mango, Shadow, Slate).
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execSync, spawn } = require('child_process');

// Default colors (will be overridden by passed colors)
let C = {
    reset: '\x1b[0m', bold: '\x1b[1m', dim: '\x1b[2m',
    cyan: '\x1b[36m', green: '\x1b[32m', red: '\x1b[31m',
    yellow: '\x1b[33m', white: '\x1b[37m', gray: '\x1b[90m',
    purple: '\x1b[35m', magenta: '\x1b[35m'
};

// Supported routers
const SUPPORTED_ROUTERS = {
    'GL-MT300N-V2': { name: 'GL.iNet Mango', arch: 'mipsel_24kc', openwrt: true },
    'GL-AR300M': { name: 'GL.iNet Shadow', arch: 'mips_24kc', openwrt: true },
    'GL-AR750S': { name: 'GL.iNet Slate', arch: 'mips_24kc', openwrt: true },
};

// Billing modes
const BILLING_MODES = {
    complementary: { name: 'Complementary', desc: 'Free internet, sponsored by venue' },
    paid: { name: 'Paid', desc: 'Pay per minute/hour/day' },
    hybrid: { name: 'Hybrid', desc: 'X minutes free + ads/videos for more time' }
};

function printBanner() {
    console.log(`
${C.purple}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C.reset}
  ${C.bold}${C.cyan}JOSFOX INTERNET${C.reset} ${C.gray}// Captive Portal Setup${C.reset}
  ${C.dim}Take control of your WiFi${C.reset}
${C.purple}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C.reset}
`);
}

function printHelp() {
    printBanner();
    console.log(`${C.bold}Usage:${C.reset} jos-cli enable-JOSFOX-internet [options]

${C.bold}Description:${C.reset}
  Transform your GL.iNet router into a monetizable captive portal.
  Installs NodogSplash, configures Firebase auth, and sets up billing.

${C.bold}Supported Routers:${C.reset}
  - GL.iNet GL-MT300N-V2 (Mango)
  - GL.iNet GL-AR300M (Shadow)
  - GL.iNet GL-AR750S (Slate)

${C.bold}Options:${C.reset}
  --router <ip>         Router IP address (default: 192.168.8.1)
  --mode <mode>         Billing mode: complementary, paid, hybrid
  --dry-run             Simulate without executing
  --skip-nodogsplash    Skip NodogSplash installation
  --help, -h            Show this help

${C.bold}Billing Modes:${C.reset}
  ${C.green}complementary${C.reset}  Free internet, venue sponsored
  ${C.yellow}paid${C.reset}           Pay per minute/hour/day
  ${C.cyan}hybrid${C.reset}         X free minutes + ads/videos for more

${C.bold}Examples:${C.reset}
  jos-cli enable-JOSFOX-internet
  jos-cli enable-JOSFOX-internet --router 192.168.8.1 --mode paid
  jos-cli enable-JOSFOX-internet --dry-run
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

async function detectRouter(routerIp) {
    console.log(`\n${C.cyan}▶${C.reset} Detecting router at ${C.bold}${routerIp}${C.reset}...`);

    try {
        // Try to ping router
        execSync(`ping -c 1 -W 2 ${routerIp}`, { stdio: 'pipe' });
        console.log(`  ${C.green}✓${C.reset} Router reachable`);

        // Try to detect model via SSH
        try {
            const model = execSync(`ssh root@${routerIp} "cat /tmp/sysinfo/model" 2>/dev/null || echo "unknown"`,
                { stdio: 'pipe', timeout: 10000 }).toString().trim();

            if (model !== 'unknown' && SUPPORTED_ROUTERS[model]) {
                console.log(`  ${C.green}✓${C.reset} Detected: ${C.bold}${SUPPORTED_ROUTERS[model].name}${C.reset} (${model})`);
                return { model, info: SUPPORTED_ROUTERS[model], ip: routerIp };
            }
        } catch (e) {
            // SSH might not be configured yet
        }

        console.log(`  ${C.yellow}⚠${C.reset} Could not auto-detect model via SSH`);
        return { model: 'unknown', info: null, ip: routerIp };
    } catch (e) {
        console.log(`  ${C.red}✖${C.reset} Router not reachable at ${routerIp}`);
        return null;
    }
}

async function setupNodogSplash(router, dryRun) {
    console.log(`\n${C.cyan}▶${C.reset} Installing NodogSplash...`);

    const commands = [
        'opkg update',
        'opkg install nodogsplash',
    ];

    for (const cmd of commands) {
        console.log(`  ${C.dim}$ ${cmd}${C.reset}`);
        if (!dryRun) {
            try {
                execSync(`ssh root@${router.ip} "${cmd}"`, { stdio: 'inherit', timeout: 60000 });
            } catch (e) {
                console.log(`  ${C.red}✖${C.reset} Failed: ${cmd}`);
                return false;
            }
        }
    }

    console.log(`  ${C.green}✓${C.reset} NodogSplash installed`);
    return true;
}

async function configureFirebase(dryRun) {
    console.log(`\n${C.cyan}▶${C.reset} Firebase Configuration`);
    console.log(`  ${C.dim}JOSFOX Cloud authentication and billing${C.reset}\n`);

    const projectId = await prompt(`  ${C.white}Firebase Project ID:${C.reset} `);
    const apiKey = await prompt(`  ${C.white}Firebase API Key:${C.reset} `);

    if (!projectId || !apiKey) {
        console.log(`  ${C.yellow}⚠${C.reset} Skipping Firebase setup (no credentials provided)`);
        return null;
    }

    const config = {
        projectId,
        apiKey,
        authDomain: `${projectId}.firebaseapp.com`,
        databaseURL: `https://${projectId}.firebaseio.com`,
    };

    console.log(`  ${C.green}✓${C.reset} Firebase configured for project: ${C.bold}${projectId}${C.reset}`);
    return config;
}

async function configureBilling(mode) {
    console.log(`\n${C.cyan}▶${C.reset} Billing Configuration`);

    const modeInfo = BILLING_MODES[mode] || BILLING_MODES.complementary;
    console.log(`  Mode: ${C.bold}${modeInfo.name}${C.reset} - ${modeInfo.desc}`);

    let pricing = {};

    if (mode === 'paid' || mode === 'hybrid') {
        const freeMinutes = mode === 'hybrid'
            ? await prompt(`  ${C.white}Free minutes:${C.reset} `) || '15'
            : '0';
        const pricePerHour = await prompt(`  ${C.white}Price per hour (USD):${C.reset} `) || '1.00';

        pricing = {
            freeMinutes: parseInt(freeMinutes),
            pricePerHour: parseFloat(pricePerHour),
            currency: 'USD'
        };
    }

    console.log(`  ${C.green}✓${C.reset} Billing configured`);
    return { mode, ...pricing };
}

async function generateConfig(router, firebase, billing, dryRun) {
    console.log(`\n${C.cyan}▶${C.reset} Generating JOSFOX Internet configuration...`);

    const config = {
        version: '1.0.0',
        router: {
            ip: router.ip,
            model: router.model,
            name: router.info?.name || 'Unknown Router'
        },
        firebase: firebase || { enabled: false },
        billing,
        portal: {
            title: 'JOSFOX Internet',
            subtitle: 'Welcome! Connect to the internet.',
            logo: null,
            primaryColor: '#6366f1'
        },
        nodogsplash: {
            gatewayInterface: 'br-lan',
            gatewayName: 'JOSFOX-Internet',
            maxClients: 250,
            sessionTimeout: billing.mode === 'complementary' ? 0 : 3600
        }
    };

    const configPath = path.join(process.env.HOME, '.jos', 'josfox-internet.json');

    if (!dryRun) {
        const josDir = path.join(process.env.HOME, '.jos');
        if (!fs.existsSync(josDir)) fs.mkdirSync(josDir, { recursive: true });
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    }

    console.log(`  ${C.green}✓${C.reset} Configuration saved to ${C.dim}${configPath}${C.reset}`);
    return config;
}

async function deployCaptivePortal(router, config, dryRun) {
    console.log(`\n${C.cyan}▶${C.reset} Deploying captive portal...`);

    const ndsConfig = `
# JOSFOX Internet - NodogSplash Configuration
# Generated by jos-cli enable-JOSFOX-internet

GatewayInterface ${config.nodogsplash.gatewayInterface}
GatewayName ${config.nodogsplash.gatewayName}
MaxClients ${config.nodogsplash.maxClients}

# Redirect to JOSFOX splash page
RedirectURL https://internet.josfox.mx/splash
`;

    console.log(`  ${C.dim}Uploading nodogsplash.conf...${C.reset}`);

    if (!dryRun) {
        try {
            // Write config to temp file and upload
            const tmpFile = '/tmp/nodogsplash.conf';
            fs.writeFileSync(tmpFile, ndsConfig);
            execSync(`scp ${tmpFile} root@${router.ip}:/etc/nodogsplash/nodogsplash.conf`, { stdio: 'pipe' });

            // Restart nodogsplash
            execSync(`ssh root@${router.ip} "/etc/init.d/nodogsplash restart"`, { stdio: 'pipe' });

            fs.unlinkSync(tmpFile);
        } catch (e) {
            console.log(`  ${C.red}✖${C.reset} Deployment failed: ${e.message}`);
            return false;
        }
    }

    console.log(`  ${C.green}✓${C.reset} Captive portal deployed`);
    return true;
}

async function execute(args, JOS_HOME, options = {}) {
    // Use passed colors if available
    if (options.C) C = options.C;

    const help = args.includes('--help') || args.includes('-h');
    const dryRun = args.includes('--dry-run');

    const routerIdx = args.indexOf('--router');
    const routerIp = routerIdx >= 0 ? args[routerIdx + 1] : '192.168.8.1';

    const modeIdx = args.indexOf('--mode');
    const mode = modeIdx >= 0 ? args[modeIdx + 1] : null;

    if (help) {
        printHelp();
        return;
    }

    printBanner();

    if (dryRun) {
        console.log(`${C.yellow}⚡ DRY RUN MODE${C.reset} — Commands will be simulated\n`);
    }

    // Step 1: Detect router
    const router = await detectRouter(routerIp);
    if (!router) {
        console.log(`\n${C.red}✖${C.reset} Setup aborted: Router not reachable`);
        console.log(`  ${C.dim}Make sure you're connected to the router's WiFi${C.reset}`);
        console.log(`  ${C.dim}Default GL.iNet IP: 192.168.8.1${C.reset}\n`);
        process.exit(1);
    }

    // Step 2: Select billing mode
    let billingMode = mode;
    if (!billingMode) {
        console.log(`\n${C.bold}Select billing mode:${C.reset}`);
        console.log(`  ${C.green}1.${C.reset} Complementary (free, venue sponsored)`);
        console.log(`  ${C.yellow}2.${C.reset} Paid (pay per minute/hour)`);
        console.log(`  ${C.cyan}3.${C.reset} Hybrid (free minutes + paid)`);

        const choice = await prompt(`\n${C.white}Choice [1-3]:${C.reset} `);
        billingMode = ['complementary', 'paid', 'hybrid'][parseInt(choice) - 1] || 'complementary';
    }

    // Step 3: NodogSplash installation
    if (!args.includes('--skip-nodogsplash')) {
        const proceed = await prompt(`\n${C.white}Install NodogSplash on router? [Y/n]:${C.reset} `);
        if (proceed.toLowerCase() !== 'n') {
            await setupNodogSplash(router, dryRun);
        }
    }

    // Step 4: Firebase configuration
    const firebase = await configureFirebase(dryRun);

    // Step 5: Billing configuration
    const billing = await configureBilling(billingMode);

    // Step 6: Generate and save config
    const config = await generateConfig(router, firebase, billing, dryRun);

    // Step 7: Deploy to router
    const proceed = await prompt(`\n${C.white}Deploy captive portal to router? [Y/n]:${C.reset} `);
    if (proceed.toLowerCase() !== 'n') {
        await deployCaptivePortal(router, config, dryRun);
    }

    // Summary
    console.log(`
${C.purple}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C.reset}
  ${C.green}✓${C.reset} ${C.bold}JOSFOX Internet Setup Complete${C.reset}
${C.purple}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C.reset}

  ${C.bold}Router:${C.reset} ${router.info?.name || 'Unknown'} (${router.ip})
  ${C.bold}Mode:${C.reset} ${BILLING_MODES[billing.mode]?.name || billing.mode}
  ${C.bold}Firebase:${C.reset} ${firebase ? 'Configured' : 'Skipped'}
  ${C.bold}Config:${C.reset} ~/.jos/josfox-internet.json

  ${C.dim}Users connecting to WiFi will see the captive portal.${C.reset}
  ${C.dim}Manage at: https://internet.josfox.mx/dashboard${C.reset}
`);
}

module.exports = { execute };
