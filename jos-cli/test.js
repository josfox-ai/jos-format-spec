#!/usr/bin/env node
/**
 * JOS-CLI Test Suite
 * Validates all commands work correctly
 */

const { execSync, spawnSync } = require('child_process');
const path = require('path');

const C = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
    dim: '\x1b[2m',
    bold: '\x1b[1m'
};

const BIN = path.join(__dirname, 'bin', 'jos');
let passed = 0;
let failed = 0;
const failures = [];

function test(name, fn) {
    try {
        fn();
        console.log(`${C.green}✓${C.reset} ${name}`);
        passed++;
    } catch (e) {
        console.log(`${C.red}✖${C.reset} ${name}`);
        console.log(`  ${C.dim}${e.message}${C.reset}`);
        failed++;
        failures.push({ name, error: e.message });
    }
}

function run(args, expectSuccess = true) {
    const result = spawnSync('node', [BIN, ...args], {
        encoding: 'utf8',
        timeout: 10000
    });

    if (expectSuccess && result.status !== 0) {
        throw new Error(`Command failed: jos-cli ${args.join(' ')}\n${result.stderr || result.stdout}`);
    }

    return {
        stdout: result.stdout || '',
        stderr: result.stderr || '',
        status: result.status
    };
}

console.log(`\n${C.cyan}${C.bold}JOS-CLI Test Suite${C.reset}\n`);
console.log(`${C.dim}Testing: ${BIN}${C.reset}\n`);

// ══════════════════════════════════════════════════════════════════════════════
// Help Tests
// ══════════════════════════════════════════════════════════════════════════════
console.log(`${C.yellow}Help Output${C.reset}`);

test('jos-cli --help shows banner', () => {
    const { stdout } = run(['--help']);
    if (!stdout.includes('JOS-CLI')) throw new Error('Missing JOS-CLI in banner');
});

test('jos-cli --help shows agent command', () => {
    const { stdout } = run(['--help']);
    if (!stdout.includes('agent')) throw new Error('Missing agent command');
});

test('jos-cli --help shows enable-service command', () => {
    const { stdout } = run(['--help']);
    if (!stdout.includes('enable-service')) throw new Error('Missing enable-service command');
});

test('jos-cli --help does NOT show non-bundled commands', () => {
    const { stdout } = run(['--help']);
    // These commands exist in @josfox/jos, not in jos-cli
    if (stdout.includes('secrets') && stdout.includes('Manage encrypted')) {
        throw new Error('Help incorrectly shows "secrets" command which is not bundled');
    }
    if (stdout.includes('enable-JOSFOX-internet')) {
        throw new Error('Help incorrectly shows "enable-JOSFOX-internet" which does not exist');
    }
});

// ══════════════════════════════════════════════════════════════════════════════
// Agent Command Tests
// ══════════════════════════════════════════════════════════════════════════════
console.log(`\n${C.yellow}Agent Command${C.reset}`);

test('jos-cli agent --help works', () => {
    const { stdout } = run(['agent', '--help']);
    if (!stdout.includes('JOS AGENT')) throw new Error('Missing JOS AGENT header');
});

test('jos-cli agent --help shows subcommands', () => {
    const { stdout } = run(['agent', '--help']);
    const required = ['install', 'uninstall', 'status', 'logs', 'list', 'run'];
    for (const cmd of required) {
        if (!stdout.includes(cmd)) throw new Error(`Missing subcommand: ${cmd}`);
    }
});

test('jos-cli agent list works', () => {
    const { stdout } = run(['agent', 'list']);
    // Should work even if no agents installed
    if (!stdout.includes('Installed Agents') && !stdout.includes('No agents')) {
        throw new Error('Unexpected output from agent list');
    }
});

// ══════════════════════════════════════════════════════════════════════════════
// Enable-Service Command Tests
// ══════════════════════════════════════════════════════════════════════════════
console.log(`\n${C.yellow}Enable-Service Command${C.reset}`);

test('jos-cli enable-service --help works', () => {
    const { stdout } = run(['enable-service', '--help']);
    if (!stdout.includes('SERVICE PROVISIONER')) throw new Error('Missing header');
});

test('jos-cli enable-service --list shows services', () => {
    const { stdout } = run(['enable-service', '--list']);
    const required = ['captive-portal', 'shared-print', 'kiosk-display'];
    for (const svc of required) {
        if (!stdout.includes(svc)) throw new Error(`Missing service: ${svc}`);
    }
});

test('jos-cli service alias works', () => {
    const { stdout } = run(['service', '--help']);
    if (!stdout.includes('SERVICE PROVISIONER')) throw new Error('Alias not working');
});

// ══════════════════════════════════════════════════════════════════════════════
// Error Handling Tests
// ══════════════════════════════════════════════════════════════════════════════
console.log(`\n${C.yellow}Error Handling${C.reset}`);

test('jos-cli unknown-command shows error', () => {
    const { stdout, status } = run(['nonexistent-command'], false);
    if (status === 0) throw new Error('Should have failed');
    if (!stdout.includes('Unknown command')) throw new Error('Missing error message');
});

// ══════════════════════════════════════════════════════════════════════════════
// Summary
// ══════════════════════════════════════════════════════════════════════════════
console.log(`\n${C.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C.reset}`);
console.log(`${C.bold}Results:${C.reset} ${C.green}${passed} passed${C.reset}, ${failed > 0 ? C.red : C.dim}${failed} failed${C.reset}`);

if (failures.length > 0) {
    console.log(`\n${C.red}Failures:${C.reset}`);
    failures.forEach(f => {
        console.log(`  ${C.red}•${C.reset} ${f.name}`);
        console.log(`    ${C.dim}${f.error}${C.reset}`);
    });
}

console.log(`${C.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C.reset}\n`);

process.exit(failed > 0 ? 1 : 0);
