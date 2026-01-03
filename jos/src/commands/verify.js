/**
 * JOS VERIFY Command - Self-Verification Suite
 * Implements "Dogfooding" strategy
 */

const fs = require('fs');
const path = require('path');
const { spawnSync, execSync } = require('child_process');

const C = {
    reset: '\x1b[0m', bold: '\x1b[1m',
    green: '\x1b[38;5;78m', red: '\x1b[38;5;196m',
    cyan: '\x1b[38;5;51m', gray: '\x1b[38;5;245m',
    yellow: '\x1b[38;5;220m'
};

exports.execute = async (args, home) => {
    console.log(`\n${C.cyan}${C.bold}🦊 JOS Self-Verification${C.reset}\n`);

    const binDir = path.join(__dirname, '..', '..', 'bin');
    const binJos = path.join(binDir, 'jos');

    // 1. PATH Injection (Crucial for Windows)
    // We add the bin directory to the front of PATH so 'jos' resolves to our binary
    const env = { ...process.env, CI: 'true' };
    env.PATH = process.platform === 'win32'
        ? `${binDir};${process.env.PATH}`
        : `${binDir}:${process.env.PATH}`;

    let failed = false;

    // 2. Dogfooding: Run verification.jos
    console.log(`${C.bold}1. Kernel Smoke Tests (verification.jos)${C.reset}`);
    const verifyArtifact = path.join(__dirname, '..', '..', 'artifacts', 'verification.jos');

    if (!fs.existsSync(verifyArtifact)) {
        console.error(`${C.red}✖ Internal Error: verification.jos not found at ${verifyArtifact}${C.reset}`);
        process.exit(1);
    }

    try {
        // We defer to the 'run' command logic by spawning a child process
        // This ensures identical execution environment to a real user run
        const result = spawnSync(process.execPath, [binJos, 'run', verifyArtifact], {
            encoding: 'utf8',
            env,
            stdio: 'inherit'
        });

        if (result.status !== 0) {
            console.error(`\n${C.red}✖ Smoke tests failed (Exit Code: ${result.status})${C.reset}`);
            failed = true;
        } else {
            console.log(`${C.green}✓ Smoke tests passed${C.reset}`);
        }

    } catch (e) {
        console.error(`${C.red}✖ Execution failed: ${e.message}${C.reset}`);
        failed = true;
    }

    // 3. Functional Test (Init + Validate)
    console.log(`\n${C.bold}2. Functional Lifecycle (Init + Validate)${C.reset}`);
    const TEST_ARTIFACT = 'native-test';
    const TEST_FILE = `${TEST_ARTIFACT}.jos`;

    // Cleanup
    if (fs.existsSync(TEST_FILE)) fs.unlinkSync(TEST_FILE);

    try {
        console.log(`${C.gray}→ Initializing ${TEST_ARTIFACT}...${C.reset}`);
        execSync(`"${process.execPath}" "${binJos}" init ${TEST_ARTIFACT} --pipeline`, { env, stdio: 'pipe' });

        if (!fs.existsSync(TEST_FILE)) {
            throw new Error('Artifact file not created');
        }

        console.log(`${C.gray}→ Validating artifact...${C.reset}`);
        execSync(`"${process.execPath}" "${binJos}" validate ${TEST_FILE}`, { env, stdio: 'pipe' });

        console.log(`${C.green}✓ Lifecycle tests passed${C.reset}`);

    } catch (e) {
        console.error(`${C.red}✖ Functional test failed: ${e.message}${C.reset}`);
        failed = true;
    } finally {
        if (fs.existsSync(TEST_FILE)) fs.unlinkSync(TEST_FILE);
    }

    console.log(`\n${C.gray}----------------------------------------${C.reset}`);
    if (failed) {
        console.log(`${C.red}${C.bold}❌ VERIFICATION FAILED${C.reset}`);
        process.exit(1);
    } else {
        console.log(`${C.green}${C.bold}✅ SYSTEM HEALTHY${C.reset}`);
        process.exit(0);
    }
};
