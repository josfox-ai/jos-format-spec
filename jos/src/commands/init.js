/**
 * JOS INIT Command - Create new .jos artifacts
 * Creates a minimal valid .jos with detached integrity manifest
 * Format version v0.0.7 — Specification maturity v0.1.0 (Alpha)
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const C = {
    reset: '\x1b[0m', bold: '\x1b[1m',
    purple: '\x1b[38;5;135m', cyan: '\x1b[38;5;51m',
    green: '\x1b[38;5;78m', gray: '\x1b[38;5;245m'
};

exports.execute = async (args, home) => {
    const name = args[0] || 'new-artifact';
    const type = args.includes('--pipeline') ? 'pipeline' : 'atom';
    const filename = `${name}.jos`;

    if (args.includes('--help') || args.includes('-h')) {
        console.log(`
${C.purple}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C.reset}
${C.bold}JOS INIT${C.reset} // Create new .jos artifacts
${C.purple}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C.reset}

${C.bold}Usage:${C.reset}
  jos init <name> [options]

${C.bold}Options:${C.reset}
  --pipeline    Create a pipeline artifact (default: atom)

${C.bold}Creates:${C.reset}
  <name>.jos           The artifact file
  <name>.jos.sig.json  Detached integrity manifest
`);
        return;
    }

    console.log(`\n${C.purple}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C.reset}`);
    console.log(`${C.bold}JOS INIT${C.reset} // ${C.gray}Creating ${type} artifact${C.reset}`);
    console.log(`${C.purple}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C.reset}\n`);

    // Create artifact with full JOSFOXAI + MAGIC compliance
    const template = {
        "$schema": "https://josfox.ai/schemas/jos-0.0.7.json",
        "$comment": "Format version v0.0.7 — Specification maturity v0.1.0 (Alpha)",

        // JOSFOXAI Kernel
        "jos": {
            "open": `jos run ${type}`,
            "supports": ["@josfox/jos", "josctl"],
            "canonical": "Format version v0.0.7 — Specification maturity v0.1.0 (Alpha)"
        },
        "orchestration_contract": {
            "version": "0.0.7",
            "mode": "sync"
        },
        "id_jos": `${type}-${name}-${Date.now()}`,
        "adaptive_ai": {
            "learning_mode": "frozen",
            "llm_friendly_sentence": `This ${type} artifact performs the ${name} task.`
        },
        "security": {
            "type": "open",
            "permissions": [],
            "health_check": null,
            "integrity": null,
            "integrity_ref": `./${filename}.sig.json`
        },
        "files": [],
        "orchestration": {
            "state": { "current_status": "idle" },
            "definitions": {
                "main_task": {
                    "type": "shell",
                    "description": "Main task - replace with your command",
                    "command": "echo 'Hello from " + name + "'"
                }
            },
            "flows": {
                "main": {
                    "description": "Main execution flow",
                    "steps": ["main_task"]
                }
            }
        },
        "x_run_params": {
            "timeout": 300,
            "retry_on_failure": false
        },

        // MAGIC Kernel
        "meta": {
            "version": "1.0.0",
            "type": type,
            "name": name,
            "provider": "local",
            "author": "JOS Developer",
            "canonical_version": "Format version v0.0.7 — Specification maturity v0.1.0 (Alpha)"
        },
        "artifacts": {
            "description": `Auto-generated ${type} artifact. Update this description.`,
            "outputs": []
        },
        "guardrails": {
            "avoid": [],
            "max_retries": 1
        },
        "intention": {
            "objective": "Define your objective here",
            "success_criteria": "Define success criteria here"
        },
        "capabilities": []
    };

    // Write artifact
    const content = JSON.stringify(template, null, 2);
    fs.writeFileSync(filename, content);
    console.log(`${C.green}✓ Created:${C.reset} ${filename}`);

    // Generate integrity manifest
    const sha256 = crypto.createHash('sha256').update(content).digest('hex');
    const stats = fs.statSync(filename);

    const manifest = {
        "$schema": "https://josfox.ai/schemas/jos-manifest-0.0.7.json",
        "manifest_version": "1.0.0",
        "artifact_ref": filename,
        "artifact_sha256": sha256,
        "artifact_size_bytes": stats.size,
        "timestamp": new Date().toISOString(),
        "generated_by": "jos init command",
        "canonical_version": "Format version v0.0.7 — Specification maturity v0.1.0 (Alpha)"
    };

    const manifestPath = filename + '.sig.json';
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log(`${C.green}✓ Created:${C.reset} ${manifestPath}`);
    console.log(`${C.gray}  SHA256: ${sha256}${C.reset}`);

    console.log(`
${C.cyan}Next steps:${C.reset}
  1. Edit ${filename} to define your tasks
  2. Run: ${C.purple}jos validate ${filename}${C.reset}
  3. Run: ${C.purple}jos run ${filename}${C.reset}
`);

    // Log to witness
    const runDir = path.join(home, 'runs', 'init-' + new Date().toISOString().replace(/[:.]/g, '-'));
    if (!fs.existsSync(runDir)) fs.mkdirSync(runDir, { recursive: true });

    const event = {
        timestamp: new Date().toISOString(),
        type: 'init:created',
        artifact: filename,
        manifest: manifestPath,
        sha256: sha256
    };
    fs.appendFileSync(path.join(runDir, 'events.jsonl'), JSON.stringify(event) + '\n');
};
