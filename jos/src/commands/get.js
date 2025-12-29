/**
 * JOS GET Command - Fetch .jos packages from repos
 * Architecture similar to npm/brew/apt but offline-first
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const crypto = require('crypto');

// AURORA colors
const C = {
    reset: '\x1b[0m', bold: '\x1b[1m', dim: '\x1b[2m',
    purple: '\x1b[38;5;135m', magenta: '\x1b[38;5;198m', cyan: '\x1b[38;5;51m',
    green: '\x1b[38;5;78m', red: '\x1b[38;5;196m', gray: '\x1b[38;5;245m',
    white: '\x1b[38;5;255m', yellow: '\x1b[38;5;220m'
};

// Default repos configuration
const DEFAULT_REPOS = {
    default: 'https://registry.josfox.ai',
    local: '~/.jos/artifacts'
};

function getReposConfig(home) {
    const reposPath = path.join(home, 'repos.json');
    if (fs.existsSync(reposPath)) {
        return { ...DEFAULT_REPOS, ...JSON.parse(fs.readFileSync(reposPath)) };
    }
    return DEFAULT_REPOS;
}

function computeIntegrity(content) {
    return crypto.createHash('sha256').update(content).digest('hex');
}

// Lock file management
function getLockPath(home) {
    return path.join(home, 'lock.json');
}

function loadLock(home) {
    const lockPath = getLockPath(home);
    if (fs.existsSync(lockPath)) {
        return JSON.parse(fs.readFileSync(lockPath, 'utf8'));
    }
    return { locked: null, packages: {} };
}

function saveLock(home, lock) {
    const lockPath = getLockPath(home);
    lock.locked = new Date().toISOString();
    fs.writeFileSync(lockPath, JSON.stringify(lock, null, 2));
}

function updateLock(home, pkgName, version, integrity) {
    const lock = loadLock(home);
    lock.packages[pkgName] = { version, integrity: `sha256-${integrity}` };
    saveLock(home, lock);
}

// Parse package reference: "pkg", "repo:pkg", "./path", "http://..."
function parsePackageRef(ref) {
    // URL
    if (ref.startsWith('http://') || ref.startsWith('https://')) {
        return { type: 'url', url: ref };
    }
    // Local path
    if (ref.startsWith('./') || ref.startsWith('/') || ref.startsWith('~')) {
        return { type: 'local', path: ref };
    }
    // Named repo: "myrepo:package"
    if (ref.includes(':')) {
        const [repo, pkg] = ref.split(':');
        return { type: 'repo', repo, package: pkg };
    }
    // Default: package name
    return { type: 'default', package: ref };
}

// Fetch from URL
function fetchUrl(url) {
    return new Promise((resolve, reject) => {
        const protocol = url.startsWith('https') ? https : http;
        protocol.get(url, (res) => {
            if (res.statusCode === 301 || res.statusCode === 302) {
                return fetchUrl(res.headers.location).then(resolve).catch(reject);
            }
            if (res.statusCode !== 200) {
                return reject(new Error(`HTTP ${res.statusCode}`));
            }
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

exports.execute = async (args, home) => {
    const target = args[0];
    const fromRepo = args.find((a, i) => args[i - 1] === '--from');
    const showHelp = args.includes('--help') || args.includes('-h');

    if (showHelp || !target) {
        console.log(`
${C.cyan}${C.bold}JOS GET${C.reset} - Fetch .jos packages

${C.white}Usage:${C.reset} jos get <package> [options]

${C.white}Package formats:${C.reset}
  jos get hello              ${C.dim}# From default registry${C.reset}
  jos get ./my-package       ${C.dim}# From local folder${C.reset}
  jos get myrepo:package     ${C.dim}# From named repo${C.reset}
  jos get http://host/p.jos  ${C.dim}# From URL${C.reset}

${C.white}Options:${C.reset}
  --from <host>   Override source (e.g., --from 192.168.1.10:1111)
  --help, -h      Show this help

${C.white}Configuration:${C.reset}
  Repos defined in: ~/.jos/repos.json
  
${C.white}Example repos.json:${C.reset}
  {
    "default": "https://registry.josfox.ai",
    "local": "~/.jos/artifacts",
    "myrepo": "http://192.168.1.10:1111"
  }
`);
        return;
    }

    console.log(`\n${C.purple}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C.reset}`);
    console.log(`${C.cyan}${C.bold}JOS GET${C.reset} // ${C.gray}Package Manager${C.reset}`);
    console.log(`${C.purple}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C.reset}\n`);

    const repos = getReposConfig(home);
    const artifactsDir = path.join(home, 'artifacts');
    if (!fs.existsSync(artifactsDir)) fs.mkdirSync(artifactsDir, { recursive: true });

    // Parse reference
    let ref = parsePackageRef(target);

    // Override with --from
    if (fromRepo) {
        const host = fromRepo.includes(':') ? fromRepo : `${fromRepo}:1111`;
        ref = { type: 'url', url: `http://${host}/${target}.jos` };
        console.log(`${C.white}📡 Source:${C.reset} ${host}`);
    }

    console.log(`${C.white}📦 Package:${C.reset} ${target}`);
    console.log(`${C.white}📁 Destination:${C.reset} ${artifactsDir}`);

    let content, sourcePath;

    try {
        switch (ref.type) {
            case 'local':
                // Local folder/file
                sourcePath = ref.path.replace('~', process.env.HOME);
                if (!sourcePath.endsWith('.jos')) sourcePath += '.jos';
                if (!fs.existsSync(sourcePath)) throw new Error(`Not found: ${sourcePath}`);
                content = fs.readFileSync(sourcePath, 'utf8');
                console.log(`${C.green}✓ Found locally:${C.reset} ${sourcePath}`);
                break;

            case 'url':
                // Direct URL
                console.log(`${C.dim}⏳ Fetching from URL...${C.reset}`);
                content = await fetchUrl(ref.url);
                console.log(`${C.green}✓ Downloaded from:${C.reset} ${ref.url}`);
                break;

            case 'repo':
                // Named repo
                const repoUrl = repos[ref.repo];
                if (!repoUrl) throw new Error(`Unknown repo: ${ref.repo}`);
                const pkgUrl = repoUrl.startsWith('http')
                    ? `${repoUrl}/${ref.package}.jos`
                    : path.join(repoUrl.replace('~', process.env.HOME), `${ref.package}.jos`);

                if (pkgUrl.startsWith('http')) {
                    console.log(`${C.dim}⏳ Fetching from ${ref.repo}...${C.reset}`);
                    content = await fetchUrl(pkgUrl);
                } else {
                    if (!fs.existsSync(pkgUrl)) throw new Error(`Not found: ${pkgUrl}`);
                    content = fs.readFileSync(pkgUrl, 'utf8');
                }
                console.log(`${C.green}✓ Found in ${ref.repo}:${C.reset} ${ref.package}`);
                break;

            case 'default':
                // Try local first, then default registry
                const localPath = path.join(artifactsDir, `${ref.package}.jos`);
                if (fs.existsSync(localPath)) {
                    console.log(`${C.green}✓ Already cached:${C.reset} ${localPath}`);
                    return;
                }

                // Try default registry
                if (repos.default && repos.default.startsWith('http')) {
                    console.log(`${C.dim}⏳ Fetching from registry...${C.reset}`);
                    try {
                        content = await fetchUrl(`${repos.default}/${ref.package}.jos`);
                        console.log(`${C.green}✓ Downloaded:${C.reset} ${ref.package}`);
                    } catch (e) {
                        throw new Error(`Package not found: ${ref.package}`);
                    }
                } else {
                    throw new Error(`Package not found: ${ref.package}`);
                }
                break;
        }

        // Validate JSON
        let artifact;
        try {
            artifact = JSON.parse(content);
        } catch (e) {
            throw new Error('Invalid .jos file (not valid JSON)');
        }

        // Compute integrity
        const integrity = computeIntegrity(content);
        console.log(`${C.white}🔐 Integrity:${C.reset} ${C.green}${integrity.substring(0, 16)}...${C.reset}`);

        // Save artifact
        const pkgName = artifact.meta?.name || artifact.name || target.replace(/[^a-z0-9]/gi, '_');
        const pkgVersion = artifact.meta?.version || artifact.orchestration_contract?.version || '1.0.0';
        const destPath = path.join(artifactsDir, `${pkgName}.jos`);
        fs.writeFileSync(destPath, content);

        // Update lock file
        updateLock(home, pkgName, pkgVersion, integrity);
        console.log(`${C.dim}📋 Lock file updated${C.reset}`);

        console.log(`\n${C.green}✓ Saved to:${C.reset} ${destPath}`);
        console.log(`${C.dim}  Run with: jos run ${pkgName}.jos${C.reset}\n`);

    } catch (e) {
        console.log(`\n${C.red}✖ Error:${C.reset} ${e.message}\n`);
        process.exit(1);
    }
};
