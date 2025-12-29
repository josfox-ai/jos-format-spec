/**
 * JOS VALIDATE Command - Validate .jos artifacts
 * Checks schema, required keys, and integrity
 * Format version v0.0.7 — Specification maturity v0.1.0 (Alpha)
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const C = {
    reset: '\x1b[0m', bold: '\x1b[1m', dim: '\x1b[2m',
    purple: '\x1b[38;5;135m', cyan: '\x1b[38;5;51m',
    green: '\x1b[38;5;78m', red: '\x1b[38;5;196m',
    yellow: '\x1b[38;5;220m', gray: '\x1b[38;5;245m'
};

// Witness Logging
function logWitness(home, eventType, data) {
    const runId = global.JOS_VALIDATE_ID || new Date().toISOString().replace(/[:.]/g, '-');
    global.JOS_VALIDATE_ID = runId;

    const runDir = path.join(home, 'runs', runId);
    if (!fs.existsSync(runDir)) fs.mkdirSync(runDir, { recursive: true });

    const event = {
        timestamp: new Date().toISOString(),
        type: `validate:${eventType}`,
        ...data
    };

    fs.appendFileSync(path.join(runDir, 'events.jsonl'), JSON.stringify(event) + '\n');
}

// Required keys for JOSFOXAI + MAGIC compliance
const JOSFOXAI_KEYS = ['jos', 'orchestration_contract', 'security', 'files', 'orchestration', 'x_run_params', 'adaptive_ai', 'id_jos'];
const MAGIC_KEYS = ['meta', 'artifacts', 'guardrails', 'intention', 'capabilities'];
const ALL_REQUIRED_KEYS = [...JOSFOXAI_KEYS, ...MAGIC_KEYS];

exports.execute = async (args, home) => {
    const target = args[0];
    const insecure = args.includes('--insecure');
    const verbose = args.includes('--verbose') || args.includes('-v');

    if (!target || args.includes('--help')) {
        console.log(`
${C.purple}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C.reset}
${C.bold}JOS VALIDATE${C.reset} // Validate .jos artifacts
${C.purple}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C.reset}

${C.bold}Usage:${C.reset}
  jos validate <file.jos> [options]

${C.bold}Options:${C.reset}
  --insecure    Skip integrity verification
  --verbose     Show detailed validation information

${C.bold}Validates:${C.reset}
  1. JSON syntax
  2. JOSFOXAI keys: ${JOSFOXAI_KEYS.join(', ')}
  3. MAGIC keys: ${MAGIC_KEYS.join(', ')}
  4. Integrity manifest (unless --insecure)
`);
        return;
    }

    console.log(`\n${C.purple}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C.reset}`);
    console.log(`${C.bold}JOS VALIDATE${C.reset} // ${C.gray}Format v0.0.7 — Spec v0.1.0 (Alpha)${C.reset}`);
    console.log(`${C.purple}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C.reset}`);
    console.log(`\n${C.cyan}📋 Artifact:${C.reset} ${target}`);

    logWitness(home, 'start', { artifact: target });

    let allPassed = true;
    const results = [];

    // 1. JSON Syntax Check
    let content, artifact;
    try {
        content = fs.readFileSync(target, 'utf8');
        artifact = JSON.parse(content);
        console.log(`${C.green}  ✓ JSON Syntax Valid${C.reset}`);
        results.push({ check: 'json_syntax', passed: true });
        logWitness(home, 'check_passed', { check: 'json_syntax' });
    } catch (e) {
        console.log(`${C.red}  ✖ JSON Error: ${e.message}${C.reset}`);
        results.push({ check: 'json_syntax', passed: false, error: e.message });
        logWitness(home, 'check_failed', { check: 'json_syntax', error: e.message });
        process.exit(1);
    }

    // 2. JOSFOXAI Keys Check
    const missingJosfoxai = JOSFOXAI_KEYS.filter(k => !artifact[k]);
    if (missingJosfoxai.length > 0) {
        console.log(`${C.red}  ✖ Missing JOSFOXAI Keys: ${missingJosfoxai.join(', ')}${C.reset}`);
        results.push({ check: 'josfoxai_keys', passed: false, missing: missingJosfoxai });
        logWitness(home, 'check_failed', { check: 'josfoxai_keys', missing: missingJosfoxai });
        allPassed = false;
    } else {
        console.log(`${C.green}  ✓ JOSFOXAI Keys Present (${JOSFOXAI_KEYS.length}/${JOSFOXAI_KEYS.length})${C.reset}`);
        results.push({ check: 'josfoxai_keys', passed: true });
        logWitness(home, 'check_passed', { check: 'josfoxai_keys' });
    }

    // 3. MAGIC Keys Check
    const missingMagic = MAGIC_KEYS.filter(k => !artifact[k]);
    if (missingMagic.length > 0) {
        console.log(`${C.red}  ✖ Missing MAGIC Keys: ${missingMagic.join(', ')}${C.reset}`);
        results.push({ check: 'magic_keys', passed: false, missing: missingMagic });
        logWitness(home, 'check_failed', { check: 'magic_keys', missing: missingMagic });
        allPassed = false;
    } else {
        console.log(`${C.green}  ✓ MAGIC Keys Present (${MAGIC_KEYS.length}/${MAGIC_KEYS.length})${C.reset}`);
        results.push({ check: 'magic_keys', passed: true });
        logWitness(home, 'check_passed', { check: 'magic_keys' });
    }

    // 4. Orchestration Structure Check
    if (artifact.orchestration) {
        const hasDefinitions = artifact.orchestration.definitions && Object.keys(artifact.orchestration.definitions).length > 0;
        const hasFlows = artifact.orchestration.flows && Object.keys(artifact.orchestration.flows).length > 0;

        if (hasDefinitions && hasFlows) {
            const defCount = Object.keys(artifact.orchestration.definitions).length;
            const flowCount = Object.keys(artifact.orchestration.flows).length;
            console.log(`${C.green}  ✓ Orchestration Structure (${defCount} definitions, ${flowCount} flows)${C.reset}`);
            results.push({ check: 'orchestration_structure', passed: true, definitions: defCount, flows: flowCount });
        } else {
            console.log(`${C.yellow}  ⚠ Orchestration may be incomplete${C.reset}`);
            results.push({ check: 'orchestration_structure', passed: true, warning: 'may be incomplete' });
        }
    }

    // 5. Integrity Check
    if (!insecure) {
        if (artifact.security?.integrity_ref) {
            const manifestPath = path.resolve(path.dirname(target), artifact.security.integrity_ref);
            if (fs.existsSync(manifestPath)) {
                try {
                    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
                    const hash = crypto.createHash('sha256').update(content).digest('hex');
                    if (hash === manifest.artifact_sha256) {
                        console.log(`${C.green}  ✓ Integrity Verified (SHA-256 match)${C.reset}`);
                        if (verbose) {
                            console.log(`${C.gray}    Hash: ${hash}${C.reset}`);
                        }
                        results.push({ check: 'integrity', passed: true, hash: hash });
                        logWitness(home, 'integrity_verified', { hash: hash, manifest: artifact.security.integrity_ref });
                    } else {
                        console.log(`${C.red}  ✖ Integrity Mismatch!${C.reset}`);
                        if (verbose) {
                            console.log(`${C.gray}    Expected: ${manifest.artifact_sha256}${C.reset}`);
                            console.log(`${C.gray}    Actual:   ${hash}${C.reset}`);
                        }
                        results.push({ check: 'integrity', passed: false, expected: manifest.artifact_sha256, actual: hash });
                        logWitness(home, 'integrity_failed', { expected: manifest.artifact_sha256, actual: hash });
                        allPassed = false;
                    }
                } catch (e) {
                    console.log(`${C.red}  ✖ Invalid Manifest: ${e.message}${C.reset}`);
                    results.push({ check: 'integrity', passed: false, error: e.message });
                    allPassed = false;
                }
            } else {
                console.log(`${C.red}  ✖ Manifest Not Found: ${artifact.security.integrity_ref}${C.reset}`);
                results.push({ check: 'integrity', passed: false, error: 'manifest not found' });
                logWitness(home, 'integrity_failed', { error: 'manifest not found' });
                allPassed = false;
            }
        } else {
            console.log(`${C.yellow}  ⚠ No Integrity Reference (security.integrity_ref)${C.reset}`);
            results.push({ check: 'integrity', passed: true, warning: 'no integrity_ref' });
        }
    } else {
        console.log(`${C.yellow}  ⚠ Integrity Check Skipped (--insecure)${C.reset}`);
        results.push({ check: 'integrity', skipped: true });
    }

    // Summary
    console.log('');
    if (allPassed) {
        console.log(`${C.green}${C.bold}✓ VALIDATION PASSED${C.reset}`);
        logWitness(home, 'success', { results: results });
    } else {
        console.log(`${C.red}${C.bold}✖ VALIDATION FAILED${C.reset}`);
        logWitness(home, 'failed', { results: results });
        process.exit(1);
    }
    console.log('');
};
