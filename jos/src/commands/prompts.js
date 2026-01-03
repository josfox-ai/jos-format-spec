/**
 * JOS PROMPTS Command - Prompt optimization via open API or Local LLM
 * Complies with JOS Prompts API Specification
 * Format version v0.0.8 — Specification maturity v0.1.0 (Alpha)
 */

const fs = require('fs');
const path = require('path');
const AdapterFactory = require('../adapters');

// AURORA colors
const C = {
    reset: '\x1b[0m', bold: '\x1b[1m', dim: '\x1b[2m',
    purple: '\x1b[38;5;135m', cyan: '\x1b[38;5;51m',
    green: '\x1b[38;5;78m', red: '\x1b[38;5;196m',
    yellow: '\x1b[38;5;220m', white: '\x1b[38;5;255m',
    gray: '\x1b[38;5;245m', blue: '\x1b[38;5;39m'
};

const DEFAULT_PROVIDER = 'https://api.josfox.cloud/prompts';

function getProviderConfig(home) {
    const configPath = path.join(home, 'prompts', 'providers.json');
    if (fs.existsSync(configPath)) {
        return JSON.parse(fs.readFileSync(configPath, 'utf8'));
    }
    return {
        providers: {
            'josfox-cloud': { url: DEFAULT_PROVIDER, type: 'native', description: 'Official JOSFOX Cloud provider' }
        },
        default: 'josfox-cloud'
    };
}

function saveProviderConfig(home, config) {
    const configDir = path.join(home, 'prompts');
    if (!fs.existsSync(configDir)) fs.mkdirSync(configDir, { recursive: true });
    fs.writeFileSync(path.join(configDir, 'providers.json'), JSON.stringify(config, null, 2));
}

function getApiKey(home) {
    const secretsPath = path.join(home, 'secrets', 'vault.json');
    if (fs.existsSync(secretsPath)) {
        try {
            const secrets = JSON.parse(fs.readFileSync(secretsPath, 'utf8'));
            return secrets.JOSFOX_API_KEY || secrets.OPENAI_API_KEY || null;
        } catch { return null; }
    }
    return process.env.JOSFOX_API_KEY || process.env.OPENAI_API_KEY || null;
}

exports.execute = async (args, home) => {
    const subcommand = args[0];

    if (args.includes('--help') || !subcommand) {
        console.log(`
${C.purple}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C.reset}
${C.bold}JOS PROMPTS${C.reset} // Prompt optimization via API or Local LLM
${C.purple}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C.reset}

${C.bold}Usage:${C.reset}
  jos prompts <subcommand> [options]

${C.bold}Subcommands:${C.reset}
  optimize <file.jos>     Optimize prompts in artifact
  validate <file.jos>     Check prompt quality
  generate "<intention>"  Create new .jos from text
  provider                Manage API providers

${C.bold}Options:${C.reset}
  --model <name>          Target model (e.g., gpt-4o, llama3)
  --provider <url>        API endpoint or Ollama URL
  --type <native|ollama>  Provider type (default: native)
  --dry-run               Show changes without writing
  --output <file>         Output file path

${C.bold}Experimental:${C.reset}
  Ollama Adapter supported via --type ollama

${C.bold}Examples:${C.reset}
  jos prompts optimize flow.jos --model llama3 --provider local
  jos prompts provider add local http://localhost:11434 ollama
  jos prompts generate "Deploy app"
`);
        return;
    }

    // Provider management
    if (subcommand === 'provider') {
        const action = args[1];
        const config = getProviderConfig(home);

        if (action === 'list' || !action) {
            console.log(`\n${C.cyan}${C.bold}Configured Providers${C.reset}\n`);
            for (const [name, info] of Object.entries(config.providers)) {
                const isDefault = config.default === name;
                const marker = isDefault ? `${C.green}★${C.reset}` : ' ';
                const typeLabel = info.type === 'ollama' ? `${C.yellow}[Ollama]${C.reset}` : `${C.blue}[Native]${C.reset}`;
                console.log(`  ${marker} ${C.bold}${name}${C.reset} ${typeLabel}`);
                console.log(`    ${C.gray}${info.url}${C.reset}`);
            }
            console.log('');
            return;
        }

        if (action === 'add') {
            const name = args[2];
            const url = args[3];
            const type = args[4] || 'native'; // 'native' or 'ollama'
            if (!name || !url) {
                console.log(`${C.red}✖ Usage: jos prompts provider add <name> <url> [type]${C.reset}`);
                return;
            }
            config.providers[name] = { url, type };
            saveProviderConfig(home, config);
            console.log(`${C.green}✓ Added provider: ${name} (${type})${C.reset}`);
            return;
        }

        if (action === 'remove') {
            const name = args[2];
            if (!config.providers[name]) return console.log(`${C.red}✖ Not found${C.reset}`);
            delete config.providers[name];
            if (config.default === name) config.default = 'josfox-cloud';
            saveProviderConfig(home, config);
            console.log(`${C.green}✓ Removed${C.reset}`);
            return;
        }
        if (action === 'default') {
            const name = args[2];
            if (!config.providers[name]) return console.log(`${C.red}✖ Not found${C.reset}`);
            config.default = name;
            saveProviderConfig(home, config);
            console.log(`${C.green}✓ Default: ${name}${C.reset}`);
            return;
        }
        return;
    }

    // Resolve Provider
    const config = getProviderConfig(home);
    const providerKey = config.default;
    const providerCfg = config.providers[providerKey] || config.providers['josfox-cloud'];

    // Allow overrides
    let providerUrl = providerCfg.url;
    let providerType = providerCfg.type || 'native';

    if (args.includes('--provider')) {
        const pName = args[args.indexOf('--provider') + 1];
        if (config.providers[pName]) {
            providerUrl = config.providers[pName].url;
            providerType = config.providers[pName].type || 'native';
        } else {
            // Assume direct URL, default to native unless --type specified
            providerUrl = pName;
        }
    }
    if (args.includes('--type')) {
        providerType = args[args.indexOf('--type') + 1];
    }

    const apiKey = getApiKey(home);
    const model = args.includes('--model') ? args[args.indexOf('--model') + 1] : null;

    // Use Factory
    const Adapter = AdapterFactory.getAdapter(providerType);

    console.log(`\n${C.purple}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C.reset}`);
    console.log(`${C.cyan}${C.bold}JOS PROMPTS${C.reset} [${subcommand.toUpperCase()}]`);
    console.log(`${C.dim}Provider: ${providerUrl} (${providerType})${C.reset}`);
    if (model) console.log(`${C.dim}Model: ${model}${C.reset}`);
    console.log(`${C.purple}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C.reset}\n`);

    try {
        if (subcommand === 'optimize') {
            const target = args[1];
            if (!target) return console.log(`${C.red}✖ Target file required${C.reset}`);

            const artifactPath = path.resolve(target.endsWith('.jos') ? target : target + '.jos');
            const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));

            console.log(`${C.yellow}⏳ Optimizing...${C.reset}`);
            const result = await Adapter.optimize(artifact, { optimization_goals: ['clarity'] }, providerUrl, model, apiKey);

            if (args.includes('--dry-run')) {
                console.log(JSON.stringify(result.optimized_artifact, null, 2));
            } else {
                fs.writeFileSync(artifactPath, JSON.stringify(result.optimized_artifact, null, 2));
                console.log(`${C.green}✓ Optimized artifact saved to ${path.basename(artifactPath)}${C.reset}`);
            }
        }
        else if (subcommand === 'validate') {
            const target = args[1];
            if (!target) return console.log(`${C.red}✖ Target file required${C.reset}`);
            const artifactPath = path.resolve(target.endsWith('.jos') ? target : target + '.jos');
            const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));

            console.log(`${C.yellow}⏳ Validating...${C.reset}`);
            const result = await Adapter.validate(artifact, providerUrl, model, apiKey);

            console.log(`${C.cyan}Quality Score:${C.reset} ${result.quality_score}`);
            console.log(`${C.cyan}Valid:${C.reset} ${result.valid}`);
            if (result.issues) result.issues.forEach(i => console.log(`  ${C.red}✖ ${i.message}${C.reset}`));
        }
        else if (subcommand === 'generate') {
            const intention = args[1];
            if (!intention) return console.log(`${C.red}✖ Intention required${C.reset}`);

            console.log(`${C.yellow}⏳ Generating...${C.reset}`);
            const result = await Adapter.generate(intention, { type: 'task' }, providerUrl, model, apiKey);

            const outputPath = args.includes('--output') ? args[args.indexOf('--output') + 1] : null;
            if (outputPath) {
                fs.writeFileSync(path.resolve(outputPath), JSON.stringify(result.artifact, null, 2));
                console.log(`${C.green}✓ Saved to ${outputPath}${C.reset}`);
            } else {
                console.log(JSON.stringify(result.artifact, null, 2));
            }
        } else {
            console.log(`${C.red}✖ Unknown subcommand${C.reset}`);
        }
    } catch (e) {
        console.error(`${C.red}✖ Error: ${e.message}${C.reset}`);
        if (e.message && e.message.includes('ECONNREFUSED')) {
            console.log(`${C.gray}  Is Ollama running? (Try 'ollama serve')${C.reset}`);
        }
    }
};
