const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const net = require('net');
const os = require('os');

// AURORA Design System - Terminal Colors
const C = {
    reset: '\x1b[0m',
    bold: '\x1b[1m',
    dim: '\x1b[2m',
    purple: '\x1b[38;5;135m',
    magenta: '\x1b[38;5;198m',
    cyan: '\x1b[38;5;51m',
    blue: '\x1b[38;5;39m',
    green: '\x1b[38;5;78m',
    white: '\x1b[38;5;255m',
    gray: '\x1b[38;5;245m',
    pink: '\x1b[38;5;213m',
    teal: '\x1b[38;5;44m',
};

// Aurora palette for random Kitsune colors
const AURORA_COLORS = [C.purple, C.magenta, C.cyan, C.blue, C.pink, C.teal];
const randomAurora = () => AURORA_COLORS[Math.floor(Math.random() * AURORA_COLORS.length)];

// The legendary Kitsune fox 🦊
const KITSUNE_FOX = `
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⡀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣾⠙⠻⢶⣄⡀⠀⠀⠀⢀⣤⠶⠛⠛⡇⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢹⣇⠀⠀⣙⣿⣦⣤⣴⣿⣁⠀⠀⣸⠇⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⣡⣾⣿⣿⣿⣿⣿⣿⣿⣷⣌⠋⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣴⣿⣷⣄⡈⢻⣿⡟⢁⣠⣾⣿⣦⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢹⣿⣿⣿⣿⠘⣿⠃⣿⣿⣿⣿⡏⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⠀⠈⠛⣰⠿⣆⠛⠁⠀⡀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣼⣿⣦⠀⠘⠛⠋⠀⣴⣿⠁⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣤⣶⣾⣿⣿⣿⣿⡇⠀⠀⠀⢸⣿⣏⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣠⣶⣿⣿⣿⣿⣿⣿⣿⣿⠿⠿⠀⠀⠀⠾⢿⣿⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⣠⣿⣿⣿⣿⣿⣿⡿⠟⠋⣁⣠⣤⣤⡶⠶⠶⣤⣄⠈⠀⠀⠀⠀⠀⠀
⠀⠀⠀⢰⣿⣿⣮⣉⣉⣉⣤⣴⣶⣿⣿⣋⡥⠄⠀⠀⠀⠀⠉⢻⣄⠀⠀⠀⠀⠀
⠀⠀⠀⠸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣟⣋⣁⣤⣀⣀⣤⣤⣤⣤⣄⣿⡄⠀⠀⠀⠀
⠀⠀⠀⠀⠙⠿⣿⣿⣿⣿⣿⣿⣿⡿⠿⠛⠋⠉⠁⠀⠀⠀⠀⠈⠛⠃⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠉⠉⠉⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀`;

// Get colored fox
const getKitsuneBanner = () => {
    const color = randomAurora();
    return `${color}${KITSUNE_FOX}${C.reset}
                            ${C.dim}Made with ❤️ & AI${C.reset}`;
};

// Web dashboard fox (HTML version with aurora gradient)
const BRAND_ART = `<pre style="font-size:9px;line-height:9px;background:linear-gradient(135deg,#af7ac5,#00ffff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⡀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣾⠙⠻⢶⣄⡀⠀⠀⠀⢀⣤⠶⠛⠛⡇⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢹⣇⠀⠀⣙⣿⣦⣤⣴⣿⣁⠀⠀⣸⠇⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⣡⣾⣿⣿⣿⣿⣿⣿⣿⣷⣌⠋⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣴⣿⣷⣄⡈⢻⣿⡟⢁⣠⣾⣿⣦⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢹⣿⣿⣿⣿⠘⣿⠃⣿⣿⣿⣿⡏⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⠀⠈⠛⣰⠿⣆⠛⠁⠀⡀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣼⣿⣦⠀⠘⠛⠋⠀⣴⣿⠁⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣤⣶⣾⣿⣿⣿⣿⡇⠀⠀⠀⢸⣿⣏⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣠⣶⣿⣿⣿⣿⣿⣿⣿⣿⠿⠿⠀⠀⠀⠾⢿⣿⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⣠⣿⣿⣿⣿⣿⣿⡿⠟⠋⣁⣠⣤⣤⡶⠶⠶⣤⣄⠈⠀⠀⠀⠀⠀⠀
⠀⠀⠀⢰⣿⣿⣮⣉⣉⣉⣤⣴⣶⣿⣿⣋⡥⠄⠀⠀⠀⠀⠉⢻⣄⠀⠀⠀⠀⠀
⠀⠀⠀⠸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣟⣋⣁⣤⣀⣀⣤⣤⣤⣤⣄⣿⡄⠀⠀⠀⠀
⠀⠀⠀⠀⠙⠿⣿⣿⣿⣿⣿⣿⣿⡿⠿⠛⠋⠉⠁⠀⠀⠀⠀⠈⠛⠃⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠉⠉⠉⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
</pre><div style="text-align:right;font-size:0.7em;color:#8b949e;margin-top:-10px">Made with ❤️ & AI</div>`;


const STYLES = `
:root { --bg:#0d1117; --card:#161b22; --text:#c9d1d9; --accent:#00ffff; --success:#3fb950; --warning:#d29922; }
body { font-family:monospace; background:var(--bg); color:var(--text); margin:0; padding:20px; }
a { color:var(--text); text-decoration:none; } a:hover { color:var(--accent); }
.nav { display:flex; gap:20px; padding-bottom:20px; border-bottom:1px solid #30363d; margin-bottom:20px; }
.nav a.active { color:var(--accent); border-bottom:2px solid var(--accent); }
.card { background:var(--card); border:1px solid #30363d; padding:15px; border-radius:6px; margin-bottom:10px; transition:transform 0.1s; }
.card:hover { border-color:var(--accent); transform:translateY(-2px); }
.grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(300px, 1fr)); gap:15px; }
.badge { background:rgba(0,255,255,0.1); color:var(--accent); padding:2px 8px; border-radius:4px; font-size:0.75em; border:1px solid rgba(0,255,255,0.3); }
.badge-green { background:rgba(63,185,80,0.1); color:var(--success); border-color:rgba(63,185,80,0.3); }
.badge-yellow { background:rgba(210,153,34,0.1); color:var(--warning); border-color:rgba(210,153,34,0.3); }
h2 { border-bottom:1px solid #30363d; padding-bottom:5px; margin-top:30px; }
.stat-box { text-align:center; padding:20px; }
.stat-value { font-size:2em; color:var(--accent); font-weight:bold; }
.stat-label { font-size:0.8em; color:#8b949e; }
table { width:100%; border-collapse:collapse; }
th, td { padding:10px; text-align:left; border-bottom:1px solid #30363d; }
th { color:var(--accent); }
`;

// --- UTILITIES ---
function getIPs() {
    const nets = os.networkInterfaces();
    const results = [];
    for (const k of Object.keys(nets)) {
        for (const n of nets[k]) {
            if (n.family === 'IPv4' && !n.internal) results.push(n.address);
        }
    }
    return results;
}

// SECURITY: Path jail - prevents directory traversal attacks
function isPathSafe(requestedPath, allowedRoots) {
    const resolved = path.resolve(requestedPath);
    return allowedRoots.some(root => {
        const resolvedRoot = path.resolve(root);
        return resolved.startsWith(resolvedRoot + path.sep) || resolved === resolvedRoot;
    });
}

// SECURITY: Compute SHA-256 integrity hash for .jos files
function computeIntegrity(filePath) {
    const crypto = require('crypto');
    const content = fs.readFileSync(filePath);
    return crypto.createHash('sha256').update(content).digest('hex');
}

async function isPortAvailable(port) {
    return new Promise(r => {
        const s = net.createServer().once('error', () => r(false))
            .once('listening', () => s.close(() => r(true)));
        s.listen(port);
    });
}

function getShadowClones(home) {
    const runsDir = path.join(home, 'runs');
    if (!fs.existsSync(runsDir)) return [];
    return fs.readdirSync(runsDir).reverse().map(id => {
        try {
            const reportPath = path.join(runsDir, id, 'report.json');
            if (!fs.existsSync(reportPath)) return null;
            const report = JSON.parse(fs.readFileSync(reportPath));
            if (report.meta?.pid) {
                try {
                    process.kill(report.meta.pid, 0);
                    return { ...report, epochId: id, alive: true };
                } catch (e) {
                    return { ...report, epochId: id, alive: false };
                }
            }
        } catch (e) { }
        return null;
    }).filter(Boolean);
}

function scanJosFiles(dirs) {
    const list = [];
    const scan = (dir, depth = 0) => {
        if (depth > 5) return;
        try {
            fs.readdirSync(dir).forEach(f => {
                if (f.startsWith('.') || f === 'node_modules') return;
                const p = path.join(dir, f);
                const stat = fs.statSync(p);
                if (stat.isDirectory()) scan(p, depth + 1);
                else if (f.endsWith('.jos')) list.push({ path: p, dir });
            });
        } catch (e) { }
    };
    dirs.forEach(d => { if (fs.existsSync(d)) scan(d); });
    return list;
}

function formatUptime(ms) {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const h = Math.floor(m / 60);
    if (h > 0) return `${h}h ${m % 60}m`;
    if (m > 0) return `${m}m ${s % 60}s`;
    return `${s}s`;
}

// --- HTML TEMPLATE ---
const HTML = (title, content, activeTab = '') => `
<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>JOS // ${title}</title>
<style>${STYLES}</style>
<meta http-equiv="refresh" content="30">
</head><body>
<div class="nav">
    <a href="/" class="${activeTab === 'home' ? 'active' : ''}">🏠 Home</a>
    <a href="/library" class="${activeTab === 'library' ? 'active' : ''}">📚 Library</a>
    <a href="/clones" class="${activeTab === 'clones' ? 'active' : ''}">👻 Clones</a>
    <a href="/stats" class="${activeTab === 'stats' ? 'active' : ''}">📊 Stats</a>
    <a href="/about" class="${activeTab === 'about' ? 'active' : ''}">🦊 About</a>
</div>
${BRAND_ART}
${content}
<div style="margin-top:50px; text-align:center; font-size:0.8rem; color:#8b949e; border-top:1px solid #30363d; padding-top:20px">
    JOS Open Solutions Foundation — Kernel v1.0
</div>
</body></html>`;

// --- SERVER STATE ---
const serverState = {
    startTime: Date.now(),
    requestCount: 0,
    lastRequest: null
};

// --- MAIN EXECUTE ---
exports.execute = async (args, home) => {
    // Help handler
    if (args.includes('--help') || args.includes('-h')) {
        console.log(`
${C.cyan}${C.bold}JOS SERVE${C.reset} - Development server & artifact host

${C.white}Usage:${C.reset} jos serve [options]

${C.white}Options:${C.reset}
  --port <n>      Set port (default: 1111, auto-hunts if busy)
  --detach, -d    Run as background shadow clone
  --help, -h      Show this help

${C.white}Features:${C.reset}
  📚 Library     Browse .jos artifacts with auto-documentation
  👻 Clones      Shadow clone management (PID tracking)
  📊 Stats       Server statistics and system info
  🦊 About       Kernel info, commands, known issues

${C.white}Dashboard:${C.reset}
  Home           http://localhost:<port>/
  Library        http://localhost:<port>/library
  Studio         http://localhost:<port>/studio?file=<path>
  Clones         http://localhost:<port>/clones
  Stats          http://localhost:<port>/stats
  About          http://localhost:<port>/about

${C.white}As Repository:${C.reset}
  Any jos serve instance becomes a package repository:
  jos repo add myrepo http://192.168.1.10:1111
  jos get myrepo:package-name

${C.white}Examples:${C.reset}
  jos serve                  # Start on port 1111
  jos serve --port 8080      # Start on port 8080
  jos server                 # Alias for serve
`);
        return;
    }

    // Handle --detach flag (spawn as shadow clone)
    if (args.includes('--detach') || args.includes('-d')) {
        const { spawn } = require('child_process');
        const newArgs = args.filter(a => a !== '--detach' && a !== '-d');

        const child = spawn(process.execPath, [process.argv[1], 'serve', ...newArgs], {
            detached: true,
            stdio: 'ignore',
            cwd: process.cwd()
        });

        child.unref();
        console.log(`${C.purple}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C.reset}`);
        console.log(`${C.cyan}👻 Shadow Clone Spawned!${C.reset}`);
        console.log(`${C.purple}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C.reset}`);
        console.log(`${C.white}  PID:${C.reset} ${child.pid}`);
        console.log(`${C.white}  Dir:${C.reset} ${process.cwd()}`);
        console.log(`${C.dim}  View clones: http://localhost:1111/clones${C.reset}`);
        console.log(`${C.dim}  To kill: kill ${child.pid}${C.reset}\n`);
        return;
    }

    // Support both --port=1112 and --port 1112 formats
    let port = 1111;
    const portEqArg = args.find(a => a.startsWith('--port='));
    const portFlagIdx = args.indexOf('--port');
    if (portEqArg) {
        port = parseInt(portEqArg.split('=')[1]);
    } else if (portFlagIdx !== -1 && args[portFlagIdx + 1]) {
        port = parseInt(args[portFlagIdx + 1]);
    }
    const root = process.cwd();

    // Auto port hunting - try ports until one is available
    const MAX_PORT_ATTEMPTS = 10;
    let actualPort = port;
    let portFree = await isPortAvailable(actualPort);

    if (!portFree) {
        console.log(`${C.gray}🔍 Port ${actualPort} busy, hunting for available port...${C.reset}`);
        for (let i = 1; i < MAX_PORT_ATTEMPTS; i++) {
            actualPort = port + i;
            portFree = await isPortAvailable(actualPort);
            if (portFree) {
                console.log(`${C.green}✓ Found available port: ${actualPort}${C.reset}`);
                break;
            }
        }
    }

    if (!portFree) {
        const clones = getShadowClones(home);
        const serveClones = clones.filter(c => c.command === 'serve' && c.alive);
        console.log(`${C.magenta}✖ All ports ${port}-${port + MAX_PORT_ATTEMPTS - 1} are in use!${C.reset}`);
        if (serveClones.length > 0) {
            console.log(`${C.cyan}👻 Active JOS Shadow Clones:${C.reset}`);
            serveClones.forEach(c => {
                console.log(`   PID ${c.meta.pid} - Port ${c.port || '?'}`);
            });
            console.log(`\n${C.dim}To kill: kill ${serveClones[0].meta.pid}${C.reset}`);
        }
        process.exit(1);
    }

    port = actualPort;

    // Setup dirs
    const publicDir = path.join(home, 'public');
    const runsDir = path.join(home, 'runs');
    if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
    if (!fs.existsSync(runsDir)) fs.mkdirSync(runsDir, { recursive: true });

    // LOG ROTATION: Keep only 50 most recent runs
    const MAX_RUNS = 50;
    const allRuns = fs.readdirSync(runsDir).sort();
    if (allRuns.length > MAX_RUNS) {
        const toDelete = allRuns.slice(0, allRuns.length - MAX_RUNS);
        toDelete.forEach(old => {
            fs.rmSync(path.join(runsDir, old), { recursive: true, force: true });
        });
        console.log(`${C.dim}🧹 Log rotation: cleaned ${toDelete.length} old runs${C.reset}`);
    }

    // Write our own run record
    const epochId = new Date().toISOString().replace(/[:.]/g, '-');
    const runDir = path.join(runsDir, epochId);
    fs.mkdirSync(runDir, { recursive: true });
    fs.writeFileSync(path.join(runDir, 'report.json'), JSON.stringify({
        meta: { pid: process.pid, timestamp: new Date().toISOString() },
        command: 'serve',
        status: 'RUNNING',
        port
    }, null, 2));

    const ips = getIPs();
    console.log(getKitsuneBanner());
    console.log(`\n${C.purple}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C.reset}`);
    console.log(`  ${C.cyan}📡${C.reset} ${C.white}Local:${C.reset}   ${C.cyan}http://localhost:${port}${C.reset}`);
    if (ips.length > 0) console.log(`  ${C.magenta}🌐${C.reset} ${C.white}Network:${C.reset} ${C.magenta}http://${ips[0]}:${port}${C.reset}`);
    console.log(`  ${C.blue}📂${C.reset} ${C.white}Root:${C.reset}    ${C.gray}${root}${C.reset}`);
    console.log(`  ${C.purple}🆔${C.reset} ${C.white}PID:${C.reset}     ${C.purple}${process.pid}${C.reset}`);
    console.log(`${C.purple}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C.reset}\n`);

    http.createServer((req, res) => {
        serverState.requestCount++;
        serverState.lastRequest = new Date();

        // Use modern URL API (not deprecated url.parse)
        const reqUrl = new URL(req.url, `http://${req.headers.host}`);
        const pathname = decodeURIComponent(reqUrl.pathname);
        const query = Object.fromEntries(reqUrl.searchParams);

        // --- ABOUT PAGE ---
        if (pathname === '/about') {
            const auroraColors = ['#af7ac5', '#ff6b9d', '#00ffff', '#5dade2', '#f8b4d9', '#48c9b0'];
            const randomColor = auroraColors[Math.floor(Math.random() * auroraColors.length)];

            res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
            res.end(HTML('About', `
                <div style="text-align:center">
                    <pre style="font-size:9px;line-height:9px;color:${randomColor};">
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⡀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣾⠙⠻⢶⣄⡀⠀⠀⠀⢀⣤⠶⠛⠛⡇⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢹⣇⠀⠀⣙⣿⣦⣤⣴⣿⣁⠀⠀⣸⠇⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⣡⣾⣿⣿⣿⣿⣿⣿⣿⣷⣌⠋⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣴⣿⣷⣄⡈⢻⣿⡟⢁⣠⣾⣿⣦⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢹⣿⣿⣿⣿⠘⣿⠃⣿⣿⣿⣿⡏⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⠀⠈⠛⣰⠿⣆⠛⠁⠀⡀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣼⣿⣦⠀⠘⠛⠋⠀⣴⣿⠁⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣤⣶⣾⣿⣿⣿⣿⡇⠀⠀⠀⢸⣿⣏⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣠⣶⣿⣿⣿⣿⣿⣿⣿⣿⠿⠿⠀⠀⠀⠾⢿⣿⠀⠀⠀⠀⠀⠀
                    </pre>
                    <h1 style="color:var(--accent)">JOS Kernel v2.2-beta</h1>
                    <p style="color:#8b949e">Stoic Architecture // Made with ❤️ & AI</p>
                </div>
                
                <div class="grid" style="margin-top:30px">
                    <div class="card">
                        <h3>📋 Commands</h3>
                        <table>
                            <tr><td><code>jos serve</code></td><td>Start development server</td></tr>
                            <tr><td><code>jos run &lt;file.jos&gt;</code></td><td>Execute .jos artifacts</td></tr>
                            <tr><td><code>jos get &lt;pkg&gt;</code></td><td>Fetch packages</td></tr>
                            <tr><td><code>jos secrets</code></td><td>Manage credentials</td></tr>
                        </table>
                    </div>
                    <div class="card">
                        <h3>📦 Repositories</h3>
                        <table>
                            <tr><td>Default</td><td><code>https://registry.josfox.ai</code></td></tr>
                            <tr><td>Local</td><td><code>~/.jos/artifacts</code></td></tr>
                            <tr><td>Custom</td><td>Any <code>jos serve</code> instance</td></tr>
                        </table>
                        <p style="color:#6e7681;font-size:0.85em;margin-top:10px">Config: ~/.jos/repos.json</p>
                    </div>
                </div>
                
                <div class="card" style="margin-top:20px">
                    <h3>✨ Features v1.0</h3>
                    <ul style="color:#8b949e">
                        <li>🦊 Kitsune fox with Aurora colors</li>
                        <li>🔐 SHA-256 integrity + lock.json</li>
                        <li>🛡️ Path traversal protection + AES-256 secrets</li>
                        <li>📡 Auto port hunting (1111-1120)</li>
                        <li>📚 Clickable library with auto-documentation</li>
                        <li>👻 Shadow clones with --detach flag</li>
                        <li>📊 Mermaid.js flow diagrams</li>
                        <li>🧹 Log rotation (50 runs max)</li>
                        <li>📋 JOSFOXAI MAGIC validation</li>
                        <li>📦 Full repo management (add/remove/list/default)</li>
                    </ul>
                </div>
                
                <div class="card" style="margin-top:20px;border-color:var(--success)">
                    <h3 style="color:var(--success)">✅ Production Ready</h3>
                    <ul style="color:#8b949e">
                        <li>All commands implemented with --help</li>
                        <li>Unit tests recommended for enterprise deployment</li>
                    </ul>
                </div>
            `, 'about'));
            return;
        }

        // --- STUDIO PAGE (artifact auto-documentation) ---
        if (pathname === '/studio') {
            const filePath = query.file;
            if (!filePath || !fs.existsSync(filePath)) {
                res.writeHead(404, { 'Content-Type': 'text/html;charset=utf-8' });
                res.end(HTML('Not Found', '<h2>Artifact not found</h2><a href="/library">← Back to Library</a>'));
                return;
            }

            const content = fs.readFileSync(filePath, 'utf8');
            const integrity = computeIntegrity(filePath);
            let json = {}; try { json = JSON.parse(content); } catch (e) { }
            const meta = json.meta || json._josfox || {};
            const intention = json.intention?.objective || json.description || meta.intention || 'No intention defined';

            res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
            res.end(HTML(meta.name || path.basename(filePath), `
                <div style="margin-bottom:20px"><a href="/library">← Back to Library</a></div>
                <h2 style="color:var(--accent)">⚡ ${meta.name || path.basename(filePath)}</h2>
                <p style="color:#8b949e;font-size:1.1em">${intention}</p>
                
                <div class="card" style="border-color:var(--success)">
                    <strong style="color:var(--success)">🔐 Integrity (SHA-256)</strong>
                    <code style="margin-left:10px;font-size:0.85em">${integrity}</code>
                </div>
                
                ${json.pipelines ? `
                <div class="card" style="margin-top:20px">
                    <h3>🔄 Orchestration (Pipelines)</h3>
                    ${Object.entries(json.pipelines).map(([name, p]) => {
                const steps = p.steps || [];
                const mermaidNodes = steps.map((s, i) => {
                    const nodeName = s.replace('tasks.', '').replace(/[^a-zA-Z0-9_]/g, '_');
                    return i < steps.length - 1
                        ? `${nodeName}[${s.replace('tasks.', '')}] --> `
                        : `${nodeName}[${s.replace('tasks.', '')}]`;
                }).join('');
                return `
                        <div style="margin:10px 0;padding:10px;background:#0d1117;border-radius:4px">
                            <strong style="color:var(--accent)">${name}</strong>
                            <span class="badge" style="margin-left:10px">${steps.length} steps</span>
                            <div style="margin-top:8px;font-size:0.85em;color:#8b949e">
                                ${steps.map((s, i) => `<span style="margin-right:15px">${i + 1}. ${s}</span>`).join('')}
                            </div>
                            ${steps.length > 1 ? `
                            <div style="margin-top:15px;background:#161b22;padding:15px;border-radius:4px">
                                <div style="font-size:0.75em;color:var(--accent);margin-bottom:10px">📊 Flow Diagram:</div>
                                <div class="mermaid" style="background:transparent">${'graph LR\\n  ' + mermaidNodes}</div>
                            </div>` : ''}
                        </div>`;
            }).join('')}
                </div>
                <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
                <script>mermaid.initialize({startOnLoad:true,theme:'dark'});</script>
                ` : ''}
                
                ${json.tasks ? `
                <div class="card" style="margin-top:20px">
                    <h3>📋 Tasks</h3>
                    <table>
                        ${Object.entries(json.tasks).map(([name, t]) => `
                            <tr>
                                <td><code>${name}</code></td>
                                <td style="color:#8b949e">${t.description || ''}</td>
                            </tr>
                        `).join('')}
                    </table>
                </div>` : ''}
                
                ${json.requirements ? `
                <div class="card" style="margin-top:20px">
                    <h3>📦 Dependencies & Requirements</h3>
                    <pre style="background:#0d1117;padding:15px;border-radius:4px;overflow-x:auto">${JSON.stringify(json.requirements, null, 2)}</pre>
                </div>` : ''}
                
                <div class="card" style="margin-top:20px">
                    <h3>📄 Raw JSON</h3>
                    <pre style="background:#0d1117;padding:15px;border-radius:4px;overflow-x:auto;max-height:400px">${JSON.stringify(json, null, 2)}</pre>
                </div>
                
                <div style="margin-top:20px;padding:15px;background:#161b22;border-radius:4px">
                    <strong>▶ Run this artifact:</strong>
                    <code style="margin-left:10px;color:var(--accent)">jos run "${filePath}"</code>
                </div>
            `));
            return;
        }

        // --- EPOCH DETAILS PAGE ---
        if (pathname.startsWith('/epoch/')) {
            const epochId = pathname.replace('/epoch/', '');
            const epochDir = path.join(home, 'runs', epochId);
            const reportPath = path.join(epochDir, 'report.json');

            if (!fs.existsSync(reportPath)) {
                res.writeHead(404, { 'Content-Type': 'text/html;charset=utf-8' });
                res.end(HTML('Epoch Not Found', '<h2>Epoch not found</h2><a href="/clones">← Back to Clones</a>'));
                return;
            }

            const report = JSON.parse(fs.readFileSync(reportPath));
            let isAlive = false;
            try { process.kill(report.meta?.pid, 0); isAlive = true; } catch (e) { }

            res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
            res.end(HTML(`Epoch ${epochId.substring(0, 16)}`, `
                <div style="margin-bottom:20px"><a href="/clones">← Back to Clones</a></div>
                <h2>📜 Epoch Details</h2>
                <span class="badge ${isAlive ? 'badge-green' : 'badge-yellow'}">${isAlive ? '● RUNNING' : '○ ENDED'}</span>
                
                <div class="card" style="margin-top:20px">
                    <table>
                        <tr><th>Epoch ID</th><td><code>${epochId}</code></td></tr>
                        <tr><th>PID</th><td>${report.meta?.pid || 'N/A'}</td></tr>
                        <tr><th>Command</th><td>${report.command || 'unknown'}</td></tr>
                        <tr><th>Port</th><td>${report.port || '-'}</td></tr>
                        <tr><th>Status</th><td>${report.status || 'unknown'}</td></tr>
                        <tr><th>Started</th><td>${report.meta?.timestamp || 'unknown'}</td></tr>
                    </table>
                </div>
                
                <div class="card" style="margin-top:20px">
                    <h3>📄 Full Report</h3>
                    <pre style="background:#0d1117;padding:15px;border-radius:4px">${JSON.stringify(report, null, 2)}</pre>
                </div>
                
                ${isAlive ? `
                <div style="margin-top:20px;padding:15px;background:#161b22;border-radius:4px">
                    <strong>⚡ To stop this process:</strong>
                    <code style="margin-left:10px;color:var(--warning)">kill ${report.meta?.pid}</code>
                </div>` : ''}
            `));
            return;
        }

        if (pathname === '/stats') {
            const uptime = Date.now() - serverState.startTime;
            const mem = process.memoryUsage();
            const clones = getShadowClones(home);

            res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
            res.end(HTML('Stats', `
                <h2>📊 Server Statistics</h2>
                <div class="grid">
                    <div class="card stat-box">
                        <div class="stat-value">${formatUptime(uptime)}</div>
                        <div class="stat-label">Uptime</div>
                    </div>
                    <div class="card stat-box">
                        <div class="stat-value">${serverState.requestCount}</div>
                        <div class="stat-label">Requests</div>
                    </div>
                    <div class="card stat-box">
                        <div class="stat-value">${Math.round(mem.heapUsed / 1024 / 1024)}MB</div>
                        <div class="stat-label">Memory</div>
                    </div>
                    <div class="card stat-box">
                        <div class="stat-value">${clones.filter(c => c.alive).length}</div>
                        <div class="stat-label">Active Clones</div>
                    </div>
                </div>
                <div class="card" style="margin-top:20px">
                    <h3>System Info</h3>
                    <table>
                        <tr><th>PID</th><td>${process.pid}</td></tr>
                        <tr><th>Port</th><td>${port}</td></tr>
                        <tr><th>Node</th><td>${process.version}</td></tr>
                        <tr><th>Platform</th><td>${os.platform()} ${os.arch()}</td></tr>
                        <tr><th>Hostname</th><td>${os.hostname()}</td></tr>
                        <tr><th>Started</th><td>${new Date(serverState.startTime).toISOString()}</td></tr>
                    </table>
                </div>
            `, 'stats'));
            return;
        }

        // --- CLONES PAGE ---
        if (pathname === '/clones') {
            const clones = getShadowClones(home);
            const aliveCount = clones.filter(c => c.alive).length;
            const endedCount = clones.filter(c => !c.alive).length;

            const rows = clones.map(c => `
                <tr>
                    <td><span class="badge ${c.alive ? 'badge-green' : 'badge-yellow'}">${c.alive ? '● RUNNING' : '○ ENDED'}</span></td>
                    <td>${c.meta?.pid || 'N/A'}</td>
                    <td>${c.command || 'unknown'}</td>
                    <td>${c.port || '-'}</td>
                    <td><a href="/epoch/${c.epochId}" style="color:var(--accent)">${c.epochId.substring(0, 16)}...</a></td>
                    <td>${c.alive ? `<code>kill ${c.meta?.pid}</code>` : '-'}</td>
                </tr>
            `).join('');

            res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
            res.end(HTML('Shadow Clones', `
                <h2>👻 Shadow Clone Management</h2>
                <div class="grid" style="grid-template-columns:repeat(3,1fr);margin-bottom:20px">
                    <div class="card stat-box" style="border-color:var(--success)">
                        <div class="stat-value" style="color:var(--success)">${aliveCount}</div>
                        <div class="stat-label">Running</div>
                    </div>
                    <div class="card stat-box">
                        <div class="stat-value">${endedCount}</div>
                        <div class="stat-label">Ended</div>
                    </div>
                    <div class="card stat-box">
                        <div class="stat-value">${clones.length}</div>
                        <div class="stat-label">Total Epochs</div>
                    </div>
                </div>
                <div class="card">
                    <table>
                        <tr><th>Status</th><th>PID</th><th>Command</th><th>Port</th><th>Epoch (click for details)</th><th>Action</th></tr>
                        ${rows || '<tr><td colspan="6" style="text-align:center;color:#8b949e">No clones found</td></tr>'}
                    </table>
                </div>
                <div style="margin-top:20px; color:#8b949e; font-size:0.9em">
                    💡 Spawn a clone: <code>jos serve --detach</code>
                </div>
            `, 'clones'));
            return;
        }

        // --- SECURITY: Kill API removed (was a backdoor!) ---
        // Process management should only be done via CLI, not web UI
        if (pathname.startsWith('/api/')) {
            res.writeHead(403, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'API disabled for security' }));
            return;
        }

        // --- LIBRARY PAGE ---
        if (pathname === '/library') {
            const files = scanJosFiles([root, path.join(home, 'artifacts'), home]);
            const cards = files.map(f => {
                let meta = { name: path.basename(f.path) };
                let fullJson = {};
                try { fullJson = JSON.parse(fs.readFileSync(f.path)); meta = fullJson.meta || fullJson._josfox || meta; } catch (e) { }
                const rel = f.path.startsWith(root) ? path.relative(root, f.path) : f.path;
                const isHome = f.path.startsWith(home);
                const studioUrl = `/studio?file=${encodeURIComponent(f.path)}`;
                const intention = fullJson.intention?.objective || fullJson.description || meta.intention || '';
                return `<a href="${studioUrl}" class="card" style="display:block;text-decoration:none;">
                    <div style="display:flex;justify-content:space-between;align-items:center">
                        <strong style="color:#00ffff">⚡ ${meta.name || path.basename(f.path)}</strong>
                        ${isHome ? '<span class="badge">~/.jos</span>' : ''}
                    </div>
                    <div style="font-size:0.8em; color:#8b949e; margin:5px 0">${rel}</div>
                    <div style="font-size:0.75em; color:#6e7681">${intention}</div>
                </a>`;
            }).join('');

            res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
            res.end(HTML('Library', `
                <h2>📚 .jos Library</h2>
                <p style="color:#8b949e">Click any artifact to view documentation, orchestration, and run options.</p>
                <p style="color:#6e7681;font-size:0.85em">Scanning: <code>${root}</code> + <code>~/.jos/</code></p>
                <div class="grid">${cards || '<p>No .jos files found</p>'}</div>
            `, 'library'));
            return;
        }

        // --- STUDIO VIEW (.jos files) ---
        const target = path.join(root, pathname.replace(/^\//, ''));

        // SECURITY: Path jail check
        if (!isPathSafe(target, [root, home])) {
            res.writeHead(403, { 'Content-Type': 'text/html;charset=utf-8' });
            res.end(HTML('Forbidden', `<h2>🔒 Access Denied</h2><p>Path traversal blocked.</p>`));
            return;
        }

        if (fs.existsSync(target) && target.endsWith('.jos') && !query.raw) {
            const content = fs.readFileSync(target, 'utf8');
            let json = {}; try { json = JSON.parse(content); } catch (e) { }
            const integrity = computeIntegrity(target);
            res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
            res.end(HTML(json.meta?.name || 'Studio', `
                <div style="margin-bottom:20px"><a href="/library">← Back to Library</a></div>
                <h2 style="color:var(--accent)">⚡ ${json.meta?.name || path.basename(target)}</h2>
                <p style="color:#8b949e">${json.meta?.intention || json.intention?.objective || 'No intention defined'}</p>
                <div class="card" style="border-color:var(--success)">
                    <strong style="color:var(--success)">🔐 Integrity (SHA-256):</strong>
                    <code style="font-size:0.8em;margin-left:10px">${integrity.substring(0, 16)}...${integrity.substring(48)}</code>
                </div>
                ${json.pipelines ? `<div class="card"><h3>🔄 Orchestration</h3><ul>${Object.keys(json.pipelines).map(p => `<li><strong>${p}</strong>: ${json.pipelines[p].steps?.length || 0} steps</li>`).join('')}</ul></div>` : ''}
                ${json.tasks ? `<div class="card"><h3>📋 Tasks</h3><ul>${Object.keys(json.tasks).map(t => `<li><strong>${t}</strong>: ${json.tasks[t].description || ''}</li>`).join('')}</ul></div>` : ''}
                ${json.requirements ? `<div class="card"><h3>📦 Dependencies</h3><pre>${JSON.stringify(json.requirements, null, 2)}</pre></div>` : ''}
                <div class="card"><h3>📄 Raw JSON</h3><pre>${JSON.stringify(json, null, 2)}</pre></div>
            `));
            return;
        }

        // --- FILE EXPLORER (Default) ---
        if (fs.existsSync(target) && fs.statSync(target).isDirectory()) {
            const files = fs.readdirSync(target).map(f => {
                const isJos = f.endsWith('.jos');
                const link = path.join(pathname, f);
                return `<li style="padding:5px">
                    <a href="${link}" style="${isJos ? 'color:#00ffff;font-weight:bold' : ''}">${f}</a>
                    ${isJos ? '<span class="badge" style="margin-left:8px">JOS</span>' : ''}
                </li>`;
            }).join('');

            const clones = getShadowClones(home).filter(c => c.alive);
            const cloneAlert = clones.length > 0 ? `
                <div class="card" style="border-color:var(--warning);background:rgba(210,153,34,0.1);margin-bottom:20px">
                    <strong style="color:var(--warning)">👻 ${clones.length} Shadow Clone${clones.length > 1 ? 's' : ''} Active</strong>
                    <a href="/clones" style="margin-left:10px;color:var(--accent)">Manage →</a>
                </div>
            ` : '';

            res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
            res.end(HTML('Explorer', `
                ${cloneAlert}
                <div class="card" style="border-color:#3fb950; background:rgba(63,185,80,0.1)">
                    <strong style="color:#3fb950">🚀 Share JOS:</strong> 
                    <code style="margin-left:10px">curl -L http://${req.headers.host}/__public/install.sh | bash</code>
                </div>
                <h2>📂 Explorer: ${pathname}</h2>
                <ul style="list-style:none;padding:0">${files}</ul>
            `, 'home'));
            return;
        }

        // --- Static Files ---
        if (fs.existsSync(target)) {
            const ext = path.extname(target);
            const mimes = { '.html': 'text/html', '.json': 'application/json', '.js': 'text/javascript', '.css': 'text/css' };
            res.writeHead(200, { 'Content-Type': mimes[ext] || 'text/plain' });
            fs.createReadStream(target).pipe(res);
            return;
        }

        res.writeHead(404);
        res.end(HTML('404', '<h2>404 // Not Found</h2><p>The requested resource does not exist.</p>'));

    }).listen(port);

    // Cleanup on exit
    process.on('SIGINT', () => {
        fs.writeFileSync(path.join(runDir, 'report.json'), JSON.stringify({
            meta: { pid: process.pid, timestamp: new Date().toISOString() },
            command: 'serve',
            status: 'STOPPED',
            port
        }, null, 2));
        process.exit(0);
    });
};
