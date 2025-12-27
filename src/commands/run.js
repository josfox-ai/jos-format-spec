/**
 * JOS RUN Command - Execute .jos artifacts
 * Complies with JOSFOXAI MAGIC contract
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');
const crypto = require('crypto');

// AURORA colors
const C = {
    reset: '\x1b[0m', bold: '\x1b[1m', dim: '\x1b[2m',
    purple: '\x1b[38;5;135m', magenta: '\x1b[38;5;198m', cyan: '\x1b[38;5;51m',
    green: '\x1b[38;5;78m', red: '\x1b[38;5;196m', gray: '\x1b[38;5;245m',
    white: '\x1b[38;5;255m', yellow: '\x1b[38;5;220m'
};

// Compute SHA-256 integrity
function computeIntegrity(content) {
    return crypto.createHash('sha256').update(content).digest('hex');
}

// Validate JOSFOXAI MAGIC contract (flexible for different schemas)
function validateMagic(artifact) {
    const errors = [];
    const warnings = [];

    // MAGIC components (Intention) - flexible detection
    const hasMeta = artifact.meta || artifact._josfox || artifact.jos_schema;
    const hasIntention = artifact.intention || artifact.meta?.intention ||
        artifact.description || artifact._josfox?.description;

    if (!hasMeta) warnings.push('Recommended: meta or _josfox');
    if (!hasIntention) warnings.push('Recommended: intention or description');

    // JOSFOXAI components (Execution) - at least one required
    const hasExecution = artifact.flow || artifact.tasks || artifact.pipelines ||
        artifact.jos || artifact.shell;
    if (!hasExecution) errors.push('Missing: execution (flow/tasks/pipelines/shell)');

    return { valid: errors.length === 0, errors, warnings };
}

exports.execute = async (args, home) => {
    const target = args[0];
    const dryRun = args.includes('--dry-run');
    const showHelp = args.includes('--help') || args.includes('-h');

    if (showHelp || !target) {
        console.log(`
${C.cyan}${C.bold}JOS RUN${C.reset} - Execute .jos artifacts

${C.white}Usage:${C.reset} jos run <file.jos> [options]

${C.white}Options:${C.reset}
  --dry-run     Validate and show plan without executing
  --task <name> Run specific task only
  --help, -h    Show this help

${C.white}Examples:${C.reset}
  jos run hello.jos
  jos run ./my-artifact.jos --dry-run
  jos run artifact.jos --task build
`);
        return;
    }

    // Resolve path
    let artifactPath = target;
    if (!fs.existsSync(artifactPath)) {
        artifactPath = path.join(home, 'artifacts', target);
        if (!fs.existsSync(artifactPath)) {
            artifactPath = path.join(process.cwd(), target);
        }
    }

    if (!fs.existsSync(artifactPath)) {
        console.log(`${C.red}✖ Artifact not found:${C.reset} ${target}`);
        console.log(`${C.dim}  Searched: ./, ~/.jos/artifacts/${C.reset}`);
        process.exit(1);
    }

    console.log(`\n${C.purple}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C.reset}`);
    console.log(`${C.cyan}${C.bold}JOS RUN${C.reset} // ${C.gray}JOSFOXAI MAGIC Runtime${C.reset}`);
    console.log(`${C.purple}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C.reset}\n`);

    // Load artifact
    const content = fs.readFileSync(artifactPath, 'utf8');
    const integrity = computeIntegrity(content);
    let artifact;

    try {
        artifact = JSON.parse(content);
    } catch (e) {
        console.log(`${C.red}✖ Invalid JSON:${C.reset} ${e.message}`);
        process.exit(1);
    }

    // Display metadata
    console.log(`${C.white}📦 Artifact:${C.reset} ${artifact.meta?.name || artifact.name || path.basename(artifactPath)}`);
    console.log(`${C.white}📄 File:${C.reset} ${artifactPath}`);
    console.log(`${C.white}🔐 Integrity:${C.reset} ${C.green}${integrity.substring(0, 16)}...${C.reset}`);

    // Validate MAGIC
    const validation = validateMagic(artifact);
    if (!validation.valid) {
        console.log(`\n${C.red}✖ MAGIC Validation Failed:${C.reset}`);
        validation.errors.forEach(e => console.log(`  ${C.red}•${C.reset} ${e}`));
        process.exit(1);
    }
    console.log(`${C.white}✓ MAGIC:${C.reset} ${C.green}Valid${C.reset}`);

    // Show intention
    const intention = artifact.intention?.objective || artifact.meta?.intention || 'No intention defined';
    console.log(`${C.white}🎯 Intention:${C.reset} ${intention}`);

    // Check guardrails
    if (artifact.guardrails?.avoid?.length > 0) {
        console.log(`${C.white}🛡️ Guardrails:${C.reset} ${artifact.guardrails.avoid.join(', ')}`);
    }

    // Determine execution mode
    const taskName = args.find((a, i) => args[i - 1] === '--task');

    console.log(`\n${C.cyan}▶ Execution Plan:${C.reset}`);

    // Execute based on artifact type
    if (artifact.pipelines && !taskName) {
        // Pipeline mode
        const pipelineNames = Object.keys(artifact.pipelines);
        console.log(`  ${C.dim}Mode: Pipeline${C.reset}`);
        pipelineNames.forEach(name => {
            const pipeline = artifact.pipelines[name];
            console.log(`  ${C.cyan}→${C.reset} ${name}: ${pipeline.steps?.length || 0} steps`);
        });

        if (dryRun) {
            console.log(`\n${C.yellow}⚡ Dry run - no execution${C.reset}`);
            return;
        }

        // Execute first pipeline
        const firstPipeline = pipelineNames[0];
        await executePipeline(artifact, firstPipeline, artifact.pipelines[firstPipeline]);

    } else if (artifact.tasks) {
        // Task mode
        const taskNames = taskName ? [taskName] : Object.keys(artifact.tasks);
        console.log(`  ${C.dim}Mode: Tasks${C.reset}`);
        taskNames.forEach(name => {
            const task = artifact.tasks[name];
            console.log(`  ${C.cyan}→${C.reset} ${name}: ${task.description || ''}`);
        });

        if (dryRun) {
            console.log(`\n${C.yellow}⚡ Dry run - no execution${C.reset}`);
            return;
        }

        // Execute tasks
        for (const name of taskNames) {
            await executeTask(name, artifact.tasks[name]);
        }

    } else if (artifact.flow?.steps) {
        // Simple flow mode
        console.log(`  ${C.dim}Mode: Flow${C.reset}`);
        artifact.flow.steps.forEach((step, i) => {
            console.log(`  ${C.cyan}${i + 1}.${C.reset} ${step}`);
        });

        if (dryRun) {
            console.log(`\n${C.yellow}⚡ Dry run - no execution${C.reset}`);
            return;
        }

        // Execute steps
        for (const step of artifact.flow.steps) {
            executeStep(step);
        }
    }

    console.log(`\n${C.green}✓ Execution complete${C.reset}\n`);
};

async function executePipeline(artifact, name, pipeline) {
    console.log(`\n${C.purple}▶ Running pipeline: ${name}${C.reset}\n`);

    for (const stepRef of pipeline.steps || []) {
        // Parse step reference (e.g., "tasks.build")
        const [type, taskName] = stepRef.split('.');

        if (type === 'tasks' && artifact.tasks[taskName]) {
            await executeTask(taskName, artifact.tasks[taskName]);
        } else {
            console.log(`  ${C.yellow}⚠ Unknown step: ${stepRef}${C.reset}`);
        }
    }
}

async function executeTask(name, task) {
    console.log(`\n${C.cyan}▶ Task: ${name}${C.reset}`);
    if (task.description) console.log(`  ${C.dim}${task.description}${C.reset}`);

    if (task.shell && Array.isArray(task.shell)) {
        const script = task.shell.join('\n');
        try {
            execSync(script, { stdio: 'inherit', shell: '/bin/bash' });
            console.log(`  ${C.green}✓ Task complete${C.reset}`);
        } catch (e) {
            console.log(`  ${C.red}✖ Task failed: ${e.message}${C.reset}`);
            throw e;
        }
    }
}

function executeStep(step) {
    console.log(`  ${C.cyan}▶${C.reset} ${step}`);
    try {
        execSync(step, { stdio: 'inherit', shell: true });
    } catch (e) {
        console.log(`  ${C.red}✖ Step failed${C.reset}`);
    }
}
