/**
 * JOS ADD Command - Add task definitions to .jos artifacts
 * Format version v0.0.7 — Specification maturity v0.1.0 (Alpha)
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const C = {
    reset: '\x1b[0m', bold: '\x1b[1m',
    purple: '\x1b[38;5;135m', cyan: '\x1b[38;5;51m',
    green: '\x1b[38;5;78m', red: '\x1b[38;5;196m',
    yellow: '\x1b[38;5;220m', gray: '\x1b[38;5;245m'
};

exports.execute = async (args, home) => {
    const help = args.includes('--help') || args.includes('-h');

    if (help || args.length < 2) {
        console.log(`
${C.purple}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C.reset}
${C.bold}JOS ADD${C.reset} // Add task definitions to .jos artifacts
${C.purple}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C.reset}

${C.bold}Usage:${C.reset}
  jos add <task-name> <file.jos> [options]

${C.bold}Options:${C.reset}
  --type <shell|jos>     Task type (default: shell)
  --command <cmd>        Shell command to execute
  --artifact <path>      Path to sub-artifact (for type=jos)
  --description <desc>   Task description
  --flow <name>          Also add to this flow's steps

${C.bold}Examples:${C.reset}
  jos add build my-artifact.jos --command "npm run build"
  jos add deploy my-artifact.jos --type jos --artifact ./deploy.jos
  jos add test my-artifact.jos --command "npm test" --flow main
`);
        return;
    }

    const taskName = args[0];
    const targetFile = args[1];

    // Parse options
    const getArg = (flag) => {
        const idx = args.indexOf(flag);
        return idx !== -1 && args[idx + 1] ? args[idx + 1] : null;
    };

    const taskType = getArg('--type') || 'shell';
    const command = getArg('--command');
    const artifact = getArg('--artifact');
    const description = getArg('--description') || `Task: ${taskName}`;
    const flowName = getArg('--flow');

    // Validate
    if (taskType === 'shell' && !command) {
        console.log(`${C.red}✖ Error: --command is required for shell tasks${C.reset}`);
        process.exit(1);
    }
    if (taskType === 'jos' && !artifact) {
        console.log(`${C.red}✖ Error: --artifact is required for jos tasks${C.reset}`);
        process.exit(1);
    }

    // Load artifact
    let artifactPath = path.resolve(targetFile);
    if (!fs.existsSync(artifactPath)) {
        console.log(`${C.red}✖ Artifact not found: ${targetFile}${C.reset}`);
        process.exit(1);
    }

    let content;
    try {
        content = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
    } catch (e) {
        console.log(`${C.red}✖ Invalid JSON: ${e.message}${C.reset}`);
        process.exit(1);
    }

    // Ensure orchestration structure exists
    if (!content.orchestration) content.orchestration = {};
    if (!content.orchestration.definitions) content.orchestration.definitions = {};
    if (!content.orchestration.flows) content.orchestration.flows = {};
    if (!content.orchestration.flows.main) content.orchestration.flows.main = { steps: [] };

    // Check for duplicate
    if (content.orchestration.definitions[taskName]) {
        console.log(`${C.yellow}⚠ Task '${taskName}' already exists. Overwriting...${C.reset}`);
    }

    // Add task definition
    const taskDef = {
        type: taskType,
        description: description
    };

    if (taskType === 'shell') {
        taskDef.command = command;
    } else if (taskType === 'jos') {
        taskDef.artifact = artifact;
    }

    content.orchestration.definitions[taskName] = taskDef;
    console.log(`${C.green}✓ Added task definition: ${taskName}${C.reset}`);

    // Add to flow if specified
    if (flowName) {
        if (!content.orchestration.flows[flowName]) {
            content.orchestration.flows[flowName] = { steps: [] };
        }
        if (!content.orchestration.flows[flowName].steps.includes(taskName)) {
            content.orchestration.flows[flowName].steps.push(taskName);
            console.log(`${C.green}✓ Added to flow: ${flowName}${C.reset}`);
        }
    }

    // Write updated artifact
    fs.writeFileSync(artifactPath, JSON.stringify(content, null, 2));
    console.log(`${C.green}✓ Updated: ${targetFile}${C.reset}`);

    // Regenerate manifest
    const manifestPath = artifactPath + '.sig.json';
    const newContent = fs.readFileSync(artifactPath, 'utf8');
    const sha256 = crypto.createHash('sha256').update(newContent).digest('hex');
    const stats = fs.statSync(artifactPath);

    const manifest = {
        "$schema": "https://josfox.ai/schemas/jos-manifest-0.0.7.json",
        "manifest_version": "1.0.0",
        "artifact_ref": path.basename(artifactPath),
        "artifact_sha256": sha256,
        "artifact_size_bytes": stats.size,
        "timestamp": new Date().toISOString(),
        "generated_by": "jos add command",
        "canonical_version": "Format version v0.0.7 — Specification maturity v0.1.0 (Alpha)"
    };

    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log(`${C.green}✓ Updated manifest: ${path.basename(manifestPath)}${C.reset}`);
    console.log(`${C.gray}  SHA256: ${sha256}${C.reset}`);
};
