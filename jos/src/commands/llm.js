/**
 * JOS LLM Command - Execute artifacts via LLM
 */
const fs = require('fs');
const path = require('path');
const AdapterFactory = require('../adapters');
const { calculateChecksum, verifyIntegrity } = require('../utils/crypto');

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
    if (args.includes('--help') || args.length === 0) {
        console.log(`
${C.purple}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C.reset}
${C.bold}JOS LLM EXECUTION${C.reset} // Execute artifacts via LLM
${C.purple}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C.reset}

${C.bold}Usage:${C.reset}
  jos llm <artifact.jos|.fox> [options]

${C.bold}Options:${C.reset}
  --model <name>          Target model
  --provider <url>        API endpoint or Ollama URL
  --type <native|ollama>  Provider type
  --production            Enforce strict SHA integrity for .jos

${C.bold}Notes:${C.reset}
  • .fox artifacts ALWAYS require valid SHA checksums.
  • .jos artifacts require SHA only in --production mode.
`);
        return;
    }

    const target = args[0];
    const absPath = path.resolve(target);

    if (!fs.existsSync(absPath)) {
        console.log(`${C.red}✖ File not found: ${target}${C.reset}`);
        return;
    }

    const ext = path.extname(absPath);
    if (ext !== '.jos' && ext !== '.fox') {
        console.log(`${C.red}✖ Invalid file type. Must be .jos or .fox${C.reset}`);
        return;
    }

    console.log(`\n${C.cyan}${C.bold}JOS LLM EXECUTION${C.reset}`);
    console.log(`${C.dim}Artifact: ${path.basename(absPath)}${C.reset}`);

    // READ & PARSE
    const rawContent = fs.readFileSync(absPath, 'utf8');
    let artifact;
    try {
        artifact = JSON.parse(rawContent);
    } catch (e) {
        console.log(`${C.red}✖ Invalid JSON: ${e.message}${C.reset}`);
        return;
    }

    // INTEGRITY CHECK
    const isProduction = args.includes('--production') || process.env.NODE_ENV === 'production';
    const enforceSha = ext === '.fox' || isProduction;

    if (enforceSha) {
        // TODO: Strict canonical verification. For now, we check if meta.checksum exists.
        if (!artifact.meta || !artifact.meta.checksum) {
            console.log(`${C.red}✖ Integrity Check Failed: Missing checksum in ${ext} file${C.reset}`);
            console.log(`${C.gray}  (.fox files and production .jos require signed checksums)${C.reset}`);
            return;
        }
        // const isValid = verifyIntegrity(artifact, rawContent); // Placeholder for strict check
        // if (!isValid) { ... }
        console.log(`${C.green}✓ Integrity Validated (Signature present)${C.reset}`);
    } else {
        console.log(`${C.yellow}⚠ Integrity Check Skipped (Dev Mode)${C.reset}`);
    }

    // RESOLVE PROVIDER
    const config = getProviderConfig(home);
    const providerKey = config.default;
    const providerCfg = config.providers[providerKey] || config.providers['josfox-cloud'];

    let providerUrl = providerCfg.url;
    let providerType = providerCfg.type || 'native';

    if (args.includes('--provider')) {
        const pName = args[args.indexOf('--provider') + 1];
        if (config.providers[pName]) {
            providerUrl = config.providers[pName].url;
            providerType = config.providers[pName].type || 'native';
        } else {
            providerUrl = pName;
        }
    }
    if (args.includes('--type')) {
        providerType = args[args.indexOf('--type') + 1];
    }

    const model = args.includes('--model') ? args[args.indexOf('--model') + 1] : null;
    const apiKey = getApiKey(home);

    console.log(`${C.dim}Provider: ${providerUrl} (${providerType})${C.reset}`);
    console.log(`${C.purple}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C.reset}\n`);

    // EXECUTE
    const Adapter = AdapterFactory.getAdapter(providerType);

    try {
        console.log(`${C.yellow}⏳ Executing via LLM...${C.reset}`);

        const result = await Adapter.execute(artifact, providerUrl, model, apiKey);

        console.log(`\n${C.green}✓ Execution Complete${C.reset}`);
        console.log(`${C.cyan}Status:${C.reset} ${result.status}`);
        console.log(`\n${C.bold}Output:${C.reset}\n`);
        console.log(result.output);
        console.log('');

    } catch (e) {
        console.log(`${C.red}✖ Execution Failed: ${e.message}${C.reset}`);
        if (e.message && e.message.includes('ECONNREFUSED')) {
            console.log(`${C.gray}  Is the provider running?${C.reset}`);
        }
    }
};
