/**
 * JOS SECRETS Command - Secure credential storage with AES-256-CBC
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// AURORA colors
const C = {
    reset: '\x1b[0m', bold: '\x1b[1m', dim: '\x1b[2m',
    purple: '\x1b[38;5;135m', magenta: '\x1b[38;5;198m', cyan: '\x1b[38;5;51m',
    green: '\x1b[38;5;78m', red: '\x1b[38;5;196m', gray: '\x1b[38;5;245m',
    white: '\x1b[38;5;255m', yellow: '\x1b[38;5;220m'
};

function ensureMasterKey(secretsDir) {
    const masterPath = path.join(secretsDir, '.master');
    if (!fs.existsSync(secretsDir)) {
        fs.mkdirSync(secretsDir, { recursive: true, mode: 0o700 });
    }
    if (!fs.existsSync(masterPath)) {
        // Generate secure master key
        const key = crypto.randomBytes(32).toString('hex');
        fs.writeFileSync(masterPath, key, { mode: 0o600 });
        console.log(`${C.green}✓ Master key generated${C.reset}`);
    }
    return Buffer.from(fs.readFileSync(masterPath, 'utf8').trim(), 'hex');
}

exports.execute = async (args, home) => {
    const action = args[0];
    const key = args[1];
    const val = args[2];
    const showHelp = args.includes('--help') || args.includes('-h');

    if (showHelp || !action) {
        console.log(`
${C.cyan}${C.bold}JOS SECRETS${C.reset} - Secure credential storage (AES-256-CBC)

${C.white}Usage:${C.reset} jos secrets <action> [key] [value]

${C.white}Actions:${C.reset}
  set <key> <value>    Encrypt and store a secret
  get <key>            Decrypt and retrieve a secret
  list                 List all secret keys (not values)
  delete <key>         Remove a secret

${C.white}Examples:${C.reset}
  jos secrets set API_KEY sk-abc123
  jos secrets get API_KEY
  jos secrets list
  jos secrets delete API_KEY

${C.white}Security:${C.reset}
  • Master key: ~/.jos/secrets/.master (0600)
  • Vault: ~/.jos/secrets/vault.json
  • Encryption: AES-256-CBC with random IV per secret
`);
        return;
    }

    const secretsDir = path.join(home, 'secrets');
    const vaultPath = path.join(secretsDir, 'vault.json');

    try {
        const masterKey = ensureMasterKey(secretsDir);
        let vault = {};
        if (fs.existsSync(vaultPath)) {
            vault = JSON.parse(fs.readFileSync(vaultPath, 'utf8'));
        }

        switch (action) {
            case 'set':
                if (!key || !val) {
                    console.log(`${C.red}✖ Usage: jos secrets set <key> <value>${C.reset}`);
                    process.exit(1);
                }
                const iv = crypto.randomBytes(16);
                const cipher = crypto.createCipheriv('aes-256-cbc', masterKey, iv);
                let encrypted = cipher.update(val, 'utf8', 'hex');
                encrypted += cipher.final('hex');
                vault[key] = iv.toString('hex') + ':' + encrypted;
                fs.writeFileSync(vaultPath, JSON.stringify(vault, null, 2), { mode: 0o600 });
                console.log(`${C.green}🔒 Secret '${key}' saved securely.${C.reset}`);
                break;

            case 'get':
                if (!key) {
                    console.log(`${C.red}✖ Usage: jos secrets get <key>${C.reset}`);
                    process.exit(1);
                }
                if (!vault[key]) {
                    console.log(`${C.yellow}⚠ Secret '${key}' not found${C.reset}`);
                    process.exit(1);
                }
                const [ivHex, encData] = vault[key].split(':');
                const decipher = crypto.createDecipheriv('aes-256-cbc', masterKey, Buffer.from(ivHex, 'hex'));
                let decrypted = decipher.update(encData, 'hex', 'utf8');
                decrypted += decipher.final('utf8');
                console.log(decrypted);
                break;

            case 'list':
                const keys = Object.keys(vault);
                if (keys.length === 0) {
                    console.log(`${C.dim}No secrets stored${C.reset}`);
                } else {
                    console.log(`${C.cyan}🔐 Stored secrets (${keys.length}):${C.reset}`);
                    keys.forEach(k => console.log(`  ${C.white}•${C.reset} ${k}`));
                }
                break;

            case 'delete':
                if (!key) {
                    console.log(`${C.red}✖ Usage: jos secrets delete <key>${C.reset}`);
                    process.exit(1);
                }
                if (vault[key]) {
                    delete vault[key];
                    fs.writeFileSync(vaultPath, JSON.stringify(vault, null, 2), { mode: 0o600 });
                    console.log(`${C.green}✓ Secret '${key}' deleted${C.reset}`);
                } else {
                    console.log(`${C.yellow}⚠ Secret '${key}' not found${C.reset}`);
                }
                break;

            default:
                console.log(`${C.red}✖ Unknown action: ${action}${C.reset}`);
                console.log(`${C.dim}Run 'jos secrets --help' for usage${C.reset}`);
                process.exit(1);
        }
    } catch (e) {
        console.log(`${C.red}✖ Error: ${e.message}${C.reset}`);
        process.exit(1);
    }
};
