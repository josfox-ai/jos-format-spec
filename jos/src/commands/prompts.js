/**
 * JOS PROMPTS Command - Prompt optimization via open API
 * Complies with JOS Prompts API Specification
 * Format version v0.0.7 — Specification maturity v0.1.0 (Alpha)
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

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
        providers: { 'josfox-cloud': { url: DEFAULT_PROVIDER, description: 'Official JOSFOX Cloud provider' } },
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

async function apiRequest(url, method, body, apiKey) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const client = urlObj.protocol === 'https:' ? https : http;

        const options = {
            hostname: urlObj.hostname,
            port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
            path: urlObj.pathname,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'jos-cli/1.0'
            }
        };

        if (apiKey) options.headers['Authorization'] = `Bearer ${apiKey}`;

        const req = client.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, data: JSON.parse(data) });
                } catch {
                    resolve({ status: res.statusCode, data: data });
                }
            });
        });

        req.on('error', reject);
        if (body) req.write(JSON.stringify(body));
        req.end();
    });
}

exports.execute = async (args, home) => {
    const subcommand = args[0];

    if (args.includes('--help') || !subcommand) {
        console.log(`
${C.purple}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C.reset}
${C.bold}JOS PROMPTS${C.reset} // Prompt optimization via open API
${C.purple}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C.reset}

${C.bold}Usage:${C.reset}
  jos prompts <subcommand> [options]

${C.bold}Subcommands:${C.reset}
  optimize <file.jos>     Optimize prompts in artifact
  validate <file.jos>     Check prompt quality
  generate "<intention>"  Create new .jos from text
  provider                Manage API providers

${C.bold}Options:${C.reset}
  --model <name>          Target model (e.g., gpt-4o-2024)
  --provider <url>        API endpoint URL
  --dry-run               Show changes without writing
  --output <file>         Output file path

${C.bold}Examples:${C.reset}
  jos prompts optimize deploy.jos --model gpt-4o-2024
  jos prompts validate my-task.jos
  jos prompts generate "Deploy to Vercel" --output deploy.jos
  jos prompts provider add my-api https://my-api.com/prompts
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
                console.log(`  ${marker} ${C.bold}${name}${C.reset}`);
                console.log(`    ${C.gray}${info.url}${C.reset}`);
                if (info.description) console.log(`    ${C.dim}${info.description}${C.reset}`);
            }
            console.log(`\n${C.gray}★ = default provider${C.reset}\n`);
            return;
        }

        if (action === 'add') {
            const name = args[2];
            const url = args[3];
            if (!name || !url) {
                console.log(`${C.red}✖ Usage: jos prompts provider add <name> <url>${C.reset}`);
                return;
            }
            config.providers[name] = { url };
            saveProviderConfig(home, config);
            console.log(`${C.green}✓ Added provider: ${name}${C.reset}`);
            return;
        }

        if (action === 'remove') {
            const name = args[2];
            if (!name) {
                console.log(`${C.red}✖ Usage: jos prompts provider remove <name>${C.reset}`);
                return;
            }
            delete config.providers[name];
            if (config.default === name) config.default = 'josfox-cloud';
            saveProviderConfig(home, config);
            console.log(`${C.green}✓ Removed provider: ${name}${C.reset}`);
            return;
        }

        if (action === 'default') {
            const name = args[2];
            if (!name || !config.providers[name]) {
                console.log(`${C.red}✖ Provider not found: ${name}${C.reset}`);
                return;
            }
            config.default = name;
            saveProviderConfig(home, config);
            console.log(`${C.green}✓ Default provider set to: ${name}${C.reset}`);
            return;
        }

        return;
    }

    // Get provider URL
    const providerConfig = getProviderConfig(home);
    let providerUrl = providerConfig.providers[providerConfig.default]?.url || DEFAULT_PROVIDER;

    if (args.includes('--provider')) {
        providerUrl = args[args.indexOf('--provider') + 1];
    }

    const apiKey = getApiKey(home);
    const dryRun = args.includes('--dry-run');
    const model = args.includes('--model') ? args[args.indexOf('--model') + 1] : null;

    // OPTIMIZE
    if (subcommand === 'optimize') {
        const target = args[1];
        if (!target) {
            console.log(`${C.red}✖ Usage: jos prompts optimize <file.jos>${C.reset}`);
            return;
        }

        let artifactPath = path.resolve(target.endsWith('.jos') ? target : target + '.jos');
        if (!fs.existsSync(artifactPath)) {
            console.log(`${C.red}✖ Artifact not found: ${artifactPath}${C.reset}`);
            return;
        }

        const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));

        console.log(`\n${C.purple}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C.reset}`);
        console.log(`${C.cyan}${C.bold}JOS PROMPTS OPTIMIZE${C.reset}`);
        console.log(`${C.purple}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C.reset}\n`);

        console.log(`${C.cyan}📦 Artifact:${C.reset} ${artifact.meta?.name || path.basename(artifactPath)}`);
        console.log(`${C.cyan}🔌 Provider:${C.reset} ${providerUrl}`);
        if (model) console.log(`${C.cyan}🤖 Model:${C.reset} ${model}`);
        console.log('');

        try {
            console.log(`${C.yellow}⏳ Optimizing prompts...${C.reset}`);

            const response = await apiRequest(`${providerUrl}/optimize`, 'POST', {
                artifact,
                options: { target_model: model, optimization_goals: ['clarity', 'specificity'] },
                format_version: '0.0.7'
            }, apiKey);

            if (response.status !== 200) {
                console.log(`${C.red}✖ API Error: ${response.data?.error?.message || response.status}${C.reset}`);
                return;
            }

            const result = response.data;

            console.log(`\n${C.green}✓ Optimization complete${C.reset}\n`);

            if (result.quality_score) {
                console.log(`${C.cyan}Quality Score:${C.reset}`);
                console.log(`  Before: ${C.yellow}${(result.quality_score.before * 100).toFixed(0)}%${C.reset}`);
                console.log(`  After:  ${C.green}${(result.quality_score.after * 100).toFixed(0)}%${C.reset}`);
            }

            if (result.changes?.length > 0) {
                console.log(`\n${C.cyan}Changes:${C.reset}`);
                for (const change of result.changes) {
                    console.log(`  ${C.bold}${change.field}${C.reset}`);
                    console.log(`    ${C.red}- ${change.original.substring(0, 60)}...${C.reset}`);
                    console.log(`    ${C.green}+ ${change.optimized.substring(0, 60)}...${C.reset}`);
                    console.log(`    ${C.dim}${change.reason}${C.reset}`);
                }
            }

            if (!dryRun && result.optimized_artifact) {
                fs.writeFileSync(artifactPath, JSON.stringify(result.optimized_artifact, null, 2));
                console.log(`\n${C.green}✓ Saved to: ${artifactPath}${C.reset}`);
            } else if (dryRun) {
                console.log(`\n${C.yellow}⚠ Dry run - changes not saved${C.reset}`);
            }

        } catch (e) {
            console.log(`${C.red}✖ Request failed: ${e.message}${C.reset}`);
            console.log(`${C.gray}  Ensure provider is accessible and API key is configured${C.reset}`);
        }

        console.log('');
        return;
    }

    // VALIDATE
    if (subcommand === 'validate') {
        const target = args[1];
        if (!target) {
            console.log(`${C.red}✖ Usage: jos prompts validate <file.jos>${C.reset}`);
            return;
        }

        let artifactPath = path.resolve(target.endsWith('.jos') ? target : target + '.jos');
        if (!fs.existsSync(artifactPath)) {
            console.log(`${C.red}✖ Artifact not found: ${artifactPath}${C.reset}`);
            return;
        }

        const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));

        console.log(`\n${C.cyan}Validating prompt quality for:${C.reset} ${path.basename(artifactPath)}\n`);

        try {
            const response = await apiRequest(`${providerUrl}/validate`, 'POST', {
                artifact,
                format_version: '0.0.7'
            }, apiKey);

            if (response.status !== 200) {
                console.log(`${C.red}✖ API Error: ${response.data?.error?.message || response.status}${C.reset}`);
                return;
            }

            const result = response.data;

            console.log(`${C.cyan}Quality Score:${C.reset} ${(result.quality_score * 100).toFixed(0)}%`);
            console.log(`${C.cyan}Valid:${C.reset} ${result.valid ? C.green + '✓ Yes' : C.red + '✖ No'}${C.reset}`);

            if (result.issues?.length > 0) {
                console.log(`\n${C.yellow}Issues:${C.reset}`);
                for (const issue of result.issues) {
                    const icon = issue.severity === 'error' ? C.red + '✖' : C.yellow + '⚠';
                    console.log(`  ${icon} ${issue.field}: ${issue.message}${C.reset}`);
                }
            }

            if (result.suggestions?.length > 0) {
                console.log(`\n${C.cyan}Suggestions:${C.reset}`);
                for (const s of result.suggestions) {
                    console.log(`  💡 ${s.field}: ${s.suggestion}`);
                }
            }

        } catch (e) {
            console.log(`${C.red}✖ Request failed: ${e.message}${C.reset}`);
        }

        console.log('');
        return;
    }

    // GENERATE
    if (subcommand === 'generate') {
        const intention = args[1];
        if (!intention) {
            console.log(`${C.red}✖ Usage: jos prompts generate "<intention>" --output <file.jos>${C.reset}`);
            return;
        }

        const outputPath = args.includes('--output') ?
            path.resolve(args[args.indexOf('--output') + 1]) : null;

        console.log(`\n${C.purple}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C.reset}`);
        console.log(`${C.cyan}${C.bold}JOS PROMPTS GENERATE${C.reset}`);
        console.log(`${C.purple}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C.reset}\n`);

        console.log(`${C.cyan}💭 Intention:${C.reset} "${intention}"`);
        console.log(`${C.cyan}🔌 Provider:${C.reset} ${providerUrl}`);
        console.log('');

        try {
            console.log(`${C.yellow}⏳ Generating artifact...${C.reset}`);

            const response = await apiRequest(`${providerUrl}/generate`, 'POST', {
                intention,
                options: { type: 'pipeline', target_model: model, include_examples: true },
                format_version: '0.0.7'
            }, apiKey);

            if (response.status !== 200) {
                console.log(`${C.red}✖ API Error: ${response.data?.error?.message || response.status}${C.reset}`);
                return;
            }

            const result = response.data;

            console.log(`\n${C.green}✓ Generated${C.reset}`);
            console.log(`${C.cyan}Confidence:${C.reset} ${(result.confidence * 100).toFixed(0)}%`);

            if (result.assumptions?.length > 0) {
                console.log(`\n${C.cyan}Assumptions:${C.reset}`);
                for (const a of result.assumptions) {
                    console.log(`  ${C.dim}• ${a}${C.reset}`);
                }
            }

            if (outputPath && result.artifact) {
                fs.writeFileSync(outputPath, JSON.stringify(result.artifact, null, 2));
                console.log(`\n${C.green}✓ Saved to: ${outputPath}${C.reset}`);
            } else if (result.artifact) {
                console.log(`\n${C.cyan}Generated Artifact:${C.reset}`);
                console.log(JSON.stringify(result.artifact, null, 2));
            }

        } catch (e) {
            console.log(`${C.red}✖ Request failed: ${e.message}${C.reset}`);
        }

        console.log('');
        return;
    }

    console.log(`${C.red}✖ Unknown subcommand: ${subcommand}${C.reset}`);
    console.log(`${C.gray}Use --help for usage information${C.reset}`);
};
