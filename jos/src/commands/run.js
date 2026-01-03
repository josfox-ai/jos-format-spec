/**
 * JOS RUN Command - Execute .jos artifacts
 * Complies with JOSFOXAI MAGIC contract
 * Integrity Strategy: Detached Manifest (.sig.json)
 * Format version v0.0.7 — Specification maturity v0.1.0 (Alpha)
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');
const crypto = require('crypto');

// AURORA colors
const C = {
    reset: '\x1b[0m', bold: '\x1b[1m', dim: '\x1b[2m',
    purple: '\x1b[38;5;135m', cyan: '\x1b[38;5;51m',
    green: '\x1b[38;5;78m', red: '\x1b[38;5;196m',
    yellow: '\x1b[38;5;220m', white: '\x1b[38;5;255m',
    gray: '\x1b[38;5;245m', blue: '\x1b[38;5;39m'
};

// Witness Logging
function logWitness(home, eventType, data) {
    const runId = global.JOS_RUN_ID || new Date().toISOString().replace(/[:.]/g, '-');
    global.JOS_RUN_ID = runId;

    const runDir = path.join(home, 'runs', runId);
    if (!fs.existsSync(runDir)) fs.mkdirSync(runDir, { recursive: true });

    const event = {
        timestamp: new Date().toISOString(),
        type: `run:${eventType}`,
        ...data
    };

    fs.appendFileSync(path.join(runDir, 'events.jsonl'), JSON.stringify(event) + '\n');
}

// Compute SHA-256 integrity
function computeIntegrity(content) {
    return crypto.createHash('sha256').update(content).digest('hex');
}

// Verify Integrity using Detached Manifest
function verifyIntegrity(artifactPath, content, artifact) {
    const integrityRef = artifact.security?.integrity_ref;
    if (!integrityRef) return { valid: true, warning: "open (no integrity_ref)" };

    const manifestPath = path.resolve(path.dirname(artifactPath), integrityRef);
    if (!fs.existsSync(manifestPath)) {
        return { valid: false, error: `Manifest not found at ${manifestPath}` };
    }

    let manifest;
    try {
        manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    } catch (e) {
        return { valid: false, error: "Invalid manifest JSON" };
    }

    const actualHash = computeIntegrity(content);
    if (actualHash !== manifest.artifact_sha256) {
        return {
            valid: false,
            error: `Hash mismatch. Expected: ${manifest.artifact_sha256.substring(0, 16)}..., Got: ${actualHash.substring(0, 16)}...`
        };
    }

    return { valid: true, verified: true, hash: actualHash };
}

exports.execute = async (args, home) => {
    const target = args[0];
    const dryRun = args.includes('--dry-run');
    const insecure = args.includes('--insecure');

    if (args.includes('--help') || !target) {
        console.log(`
${C.purple}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C.reset}
${C.bold}JOS RUN${C.reset} // Execute .jos artifacts
${C.purple}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C.reset}

${C.bold}Usage:${C.reset}
  jos run <file.jos> [options]

${C.bold}Options:${C.reset}
  --flow <name>    Flow to execute (default: main)
  --dry-run        Simulate without executing
  --insecure       Skip integrity verification

${C.bold}Example:${C.reset}
  jos run orchestration.jos --flow publish_all --dry-run
`);
        return;
    }

    let artifactPath = path.resolve(target);
    if (!fs.existsSync(artifactPath)) {
        if (fs.existsSync(path.join(home, 'artifacts', target))) {
            artifactPath = path.join(home, 'artifacts', target);
        } else {
            console.log(`${C.red}✖ Artifact not found:${C.reset} ${target}`);
            process.exit(1);
        }
    }

    const content = fs.readFileSync(artifactPath, 'utf8');
    const artifact = JSON.parse(content);

    // Init Witness
    logWitness(home, 'start', { artifact: artifactPath, dryRun: dryRun });

    // Header
    console.log(`\n${C.purple}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C.reset}`);
    console.log(`${C.cyan}${C.bold}JOS RUN${C.reset} // ${C.gray}JOSFOXAI MAGIC Runtime${C.reset}`);
    console.log(`${C.purple}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C.reset}\n`);

    // Mode indicator
    if (dryRun) {
        console.log(`${C.yellow}${C.bold}⚡ DRY RUN MODE${C.reset} ${C.gray}— No commands will be executed${C.reset}\n`);
    }

    // Artifact info
    console.log(`${C.cyan}📦 Artifact:${C.reset} ${artifact.meta?.name || path.basename(artifactPath)}`);
    console.log(`${C.cyan}📄 File:${C.reset} ${path.basename(artifactPath)}`);
    console.log(`${C.cyan}🆔 ID:${C.reset} ${artifact.id_jos || 'N/A'}`);

    // Integrity verification
    if (!insecure) {
        const integrity = verifyIntegrity(artifactPath, content, artifact);
        if (!integrity.valid) {
            console.log(`${C.cyan}🔐 Integrity:${C.reset} ${C.red}FAILED - ${integrity.error}${C.reset}`);
            logWitness(home, 'integrity_failed', { error: integrity.error });
            process.exit(1);
        } else if (integrity.verified) {
            console.log(`${C.cyan}🔐 Integrity:${C.reset} ${C.green}✓ Verified${C.reset} ${C.gray}(${integrity.hash.substring(0, 16)}...)${C.reset}`);
            logWitness(home, 'integrity_verified', { hash: integrity.hash });
        } else {
            console.log(`${C.cyan}🔐 Integrity:${C.reset} ${C.yellow}⚠ ${integrity.warning}${C.reset}`);
        }
    } else {
        console.log(`${C.cyan}🔐 Integrity:${C.reset} ${C.yellow}⚠ Skipped (--insecure)${C.reset}`);
    }

    // MAGIC validation
    const hasMagic = artifact.intention && artifact.guardrails && artifact.capabilities;
    console.log(`${C.cyan}✨ MAGIC:${C.reset} ${hasMagic ? C.green + '✓ Valid' : C.yellow + '⚠ Partial'}${C.reset}`);

    // Intention
    if (artifact.intention?.objective) {
        console.log(`${C.cyan}🎯 Intention:${C.reset} ${artifact.intention.objective}`);
    }

    // Guardrails
    if (artifact.guardrails?.avoid?.length > 0) {
        console.log(`${C.cyan}🛡️ Guardrails:${C.reset} ${artifact.guardrails.avoid.join(', ')}`);
    }

    // Flow selection
    const flowName = args.includes('--flow') ? args[args.indexOf('--flow') + 1] : 'main';
    const flow = artifact.orchestration?.flows?.[flowName] ||
        artifact.orchestration?.pipelines?.[flowName];

    if (!flow) {
        console.log(`\n${C.red}✖ Flow '${flowName}' not found.${C.reset}`);
        const available = [
            ...Object.keys(artifact.orchestration?.flows || {}),
            ...Object.keys(artifact.orchestration?.pipelines || {})
        ];
        if (available.length > 0) {
            console.log(`${C.gray}Available flows: ${available.join(', ')}${C.reset}`);
        }
        process.exit(1);
    }

    // Execution plan
    console.log(`\n${C.cyan}▶ Flow:${C.reset} ${C.bold}${flowName}${C.reset}`);
    if (flow.description) {
        console.log(`${C.gray}  ${flow.description}${C.reset}`);
    }
    console.log(`${C.gray}  Steps: ${flow.steps?.join(' → ') || 'none'}${C.reset}\n`);

    // Execute steps
    let stepIndex = 0;
    for (const stepName of flow.steps || []) {
        stepIndex++;
        const def = artifact.orchestration.definitions?.[stepName];

        if (!def) {
            console.log(`${C.red}  [${stepIndex}] ✖ ${stepName}: Definition not found${C.reset}`);
            logWitness(home, 'step_error', { step: stepName, error: 'definition not found' });
            continue;
        }

        logWitness(home, 'step_start', { step: stepName, type: def.type, index: stepIndex });

        const typeIcon = def.type === 'shell' ? '⚡' : def.type === 'jos' ? '📦' : '●';

        if (dryRun) {
            console.log(`${C.yellow}  [${stepIndex}] ${typeIcon} ${stepName}${C.reset}`);
            if (def.description) console.log(`${C.gray}      ${def.description}${C.reset}`);
            if (def.type === 'shell') {
                const cmdPreview = def.command.length > 60 ? def.command.substring(0, 60) + '...' : def.command;
                console.log(`${C.dim}      $ ${cmdPreview}${C.reset}`);
            } else if (def.type === 'jos') {
                console.log(`${C.dim}      → ${def.artifact}${C.reset}`);
            }
            logWitness(home, 'step_dry_run', { step: stepName });
            continue;
        }

        // Real execution
        console.log(`${C.blue}  [${stepIndex}] ${typeIcon} ${stepName}...${C.reset}`);

        try {
            if (def.type === 'shell') {
                execSync(def.command, { stdio: 'inherit' });
                console.log(`${C.green}      ✓ Complete${C.reset}`);
            } else if (def.type === 'jos') {
                console.log(`${C.purple}      Running sub-artifact: ${def.artifact}${C.reset}`);
                const subPath = path.resolve(path.dirname(artifactPath), def.artifact);
                const binJos = process.argv[1];
                execSync(`${process.execPath} "${binJos}" run "${subPath}" ${insecure ? '--insecure' : ''} --flow main`, {
                    stdio: 'inherit'
                });
            }
            logWitness(home, 'step_complete', { step: stepName, success: true });
        } catch (e) {
            console.log(`${C.red}      ✖ Failed: ${e.message}${C.reset}`);
            logWitness(home, 'step_failed', { step: stepName, error: e.message });
            logWitness(home, 'run_failed', { lastStep: stepName });
            process.exit(1);
        }
    }

    // Success
    console.log(`\n${C.green}${C.bold}✓ ${dryRun ? 'Dry run complete' : 'Execution complete'}${C.reset}`);
    if (artifact.intention?.success_criteria) {
        console.log(`${C.gray}  Success criteria: ${artifact.intention.success_criteria}${C.reset}`);
    }
    console.log('');

    logWitness(home, 'success', { dryRun: dryRun, stepsExecuted: stepIndex });
};
