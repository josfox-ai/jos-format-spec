/**
 * JOS REPO Command - Manage package repositories
 */

const fs = require('fs');
const path = require('path');

// AURORA colors
const C = {
    reset: '\x1b[0m', bold: '\x1b[1m', dim: '\x1b[2m',
    purple: '\x1b[38;5;135m', magenta: '\x1b[38;5;198m', cyan: '\x1b[38;5;51m',
    green: '\x1b[38;5;78m', red: '\x1b[38;5;196m', gray: '\x1b[38;5;245m',
    white: '\x1b[38;5;255m', yellow: '\x1b[38;5;220m'
};

const DEFAULT_REPOS = {
    default: 'https://registry.josfox.ai',
    local: '~/.jos/artifacts'
};

function getReposPath(home) {
    return path.join(home, 'repos.json');
}

function loadRepos(home) {
    const reposPath = getReposPath(home);
    if (fs.existsSync(reposPath)) {
        return { ...DEFAULT_REPOS, ...JSON.parse(fs.readFileSync(reposPath, 'utf8')) };
    }
    return { ...DEFAULT_REPOS };
}

function saveRepos(home, repos) {
    const reposPath = getReposPath(home);
    fs.writeFileSync(reposPath, JSON.stringify(repos, null, 2));
}

exports.execute = async (args, home) => {
    const action = args[0];
    const name = args[1];
    const url = args[2];
    const showHelp = args.includes('--help') || args.includes('-h');

    if (showHelp || !action) {
        console.log(`
${C.cyan}${C.bold}JOS REPO${C.reset} - Manage package repositories

${C.white}Usage:${C.reset} jos repo <action> [name] [url]

${C.white}Actions:${C.reset}
  list                 Show all configured repos
  add <name> <url>     Add a new repository
  remove <name>        Remove a repository
  default <name>       Set default repository

${C.white}Examples:${C.reset}
  jos repo list
  jos repo add myserver http://192.168.1.10:1111
  jos repo add company https://artifacts.company.com
  jos repo default myserver
  jos repo remove myserver

${C.white}Using repos:${C.reset}
  jos get myserver:package-name
  jos get package --from 192.168.1.10
`);
        return;
    }

    const repos = loadRepos(home);

    switch (action) {
        case 'list':
            console.log(`\n${C.cyan}${C.bold}📦 Configured Repositories${C.reset}\n`);
            Object.entries(repos).forEach(([name, url]) => {
                const isDefault = name === 'default';
                const isLocal = name === 'local';
                console.log(`  ${C.white}${name}${C.reset}`);
                console.log(`    ${C.gray}${url}${C.reset}`);
                if (isDefault) console.log(`    ${C.green}★ Default registry${C.reset}`);
                if (isLocal) console.log(`    ${C.cyan}📁 Local artifacts${C.reset}`);
                console.log();
            });
            console.log(`${C.dim}Config: ~/.jos/repos.json${C.reset}\n`);
            break;

        case 'add':
            if (!name || !url) {
                console.log(`${C.red}✖ Usage: jos repo add <name> <url>${C.reset}`);
                process.exit(1);
            }
            if (repos[name] && name !== 'default' && name !== 'local') {
                console.log(`${C.yellow}⚠ Repository '${name}' already exists. Updating...${C.reset}`);
            }
            repos[name] = url;
            saveRepos(home, repos);
            console.log(`${C.green}✓ Repository '${name}' added: ${url}${C.reset}`);
            console.log(`${C.dim}  Use: jos get ${name}:package-name${C.reset}`);
            break;

        case 'remove':
        case 'rm':
            if (!name) {
                console.log(`${C.red}✖ Usage: jos repo remove <name>${C.reset}`);
                process.exit(1);
            }
            if (name === 'default' || name === 'local') {
                console.log(`${C.red}✖ Cannot remove built-in repository '${name}'${C.reset}`);
                process.exit(1);
            }
            if (!repos[name]) {
                console.log(`${C.yellow}⚠ Repository '${name}' not found${C.reset}`);
                process.exit(1);
            }
            delete repos[name];
            saveRepos(home, repos);
            console.log(`${C.green}✓ Repository '${name}' removed${C.reset}`);
            break;

        case 'default':
            if (!name) {
                console.log(`${C.white}Current default: ${repos.default}${C.reset}`);
                return;
            }
            if (!repos[name] && !name.startsWith('http')) {
                console.log(`${C.red}✖ Repository '${name}' not found${C.reset}`);
                process.exit(1);
            }
            repos.default = repos[name] || name;
            saveRepos(home, repos);
            console.log(`${C.green}✓ Default repository set to: ${repos.default}${C.reset}`);
            break;

        default:
            console.log(`${C.red}✖ Unknown action: ${action}${C.reset}`);
            console.log(`${C.dim}Run 'jos repo --help' for usage${C.reset}`);
            process.exit(1);
    }
};
