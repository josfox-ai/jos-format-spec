/**
 * JOS Lite - PWA Application
 * .jos artifact parser, validator, and runner for the browser
 */

// Register Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .then(() => console.log('🦊 JOS Lite: Service Worker registered'))
        .catch(err => console.error('SW registration failed:', err));
}

// DOM Elements
const editor = document.getElementById('editor');
const lineNumbers = document.getElementById('line-numbers');
const fileInput = document.getElementById('file-input');
const fileName = document.getElementById('file-name');
const cursorPos = document.getElementById('cursor-pos');
const jsonStatus = document.getElementById('json-status');
const validationResults = document.getElementById('validation-results');
const provider = document.getElementById('provider');
const apiKeySection = document.getElementById('api-key-section');
const apiKey = document.getElementById('api-key');
const runOutput = document.getElementById('output-text');
const offlineStatus = document.getElementById('offline-status');

let currentFile = 'untitled.jos';
let currentArtifact = null;

// Navigation
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const view = btn.dataset.view;

        // Update nav buttons
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Update views
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        document.getElementById(`${view}-view`).classList.add('active');
    });
});

// Line Numbers
function updateLineNumbers() {
    const lines = editor.value.split('\n').length;
    lineNumbers.innerHTML = Array.from({ length: lines }, (_, i) => i + 1).join('<br>');
}

// JSON Validation
function validateJSON() {
    try {
        currentArtifact = JSON.parse(editor.value);
        jsonStatus.textContent = '✓ Valid JSON';
        jsonStatus.className = 'valid';
        return true;
    } catch (e) {
        jsonStatus.textContent = `✖ ${e.message.split(' at ')[0]}`;
        jsonStatus.className = 'invalid';
        currentArtifact = null;
        return false;
    }
}

// JOS Specification Validation
function validateJOS(artifact) {
    const issues = [];
    const warnings = [];

    // Required fields
    if (!artifact.intention) {
        issues.push({ severity: 'error', message: 'Missing required field: intention' });
    } else {
        if (!artifact.intention.objective) {
            issues.push({ severity: 'error', message: 'intention.objective is required' });
        }
    }

    // Meta validation
    if (!artifact.meta) {
        warnings.push({ severity: 'warning', message: 'No meta block - consider adding name/version' });
    }

    // Orchestration validation
    if (artifact.orchestration) {
        if (artifact.orchestration.definitions) {
            Object.entries(artifact.orchestration.definitions).forEach(([key, def]) => {
                if (!def.type) {
                    warnings.push({ severity: 'warning', message: `Definition "${key}" missing type` });
                }
            });
        }
    }

    // Guardrails check
    if (!artifact.guardrails) {
        warnings.push({ severity: 'warning', message: 'No guardrails defined - consider adding safety constraints' });
    }

    return { issues, warnings, valid: issues.length === 0 };
}

// Update Validation Panel
function updateValidationPanel() {
    if (!currentArtifact) {
        validationResults.innerHTML = '<p class="placeholder">Load a valid .jos file to validate</p>';
        return;
    }

    const result = validateJOS(currentArtifact);

    let html = `
    <div style="margin-bottom:16px">
      <strong style="color:${result.valid ? '#3fb950' : '#f85149'}">
        ${result.valid ? '✓ Artifact is valid' : '✖ Validation failed'}
      </strong>
    </div>
  `;

    if (result.issues.length > 0) {
        html += '<h4 style="color:#f85149;margin-bottom:8px">Errors:</h4><ul>';
        result.issues.forEach(i => {
            html += `<li style="color:#f85149">${i.message}</li>`;
        });
        html += '</ul>';
    }

    if (result.warnings.length > 0) {
        html += '<h4 style="color:#d29922;margin:16px 0 8px">Warnings:</h4><ul>';
        result.warnings.forEach(w => {
            html += `<li style="color:#d29922">${w.message}</li>`;
        });
        html += '</ul>';
    }

    if (result.valid && result.warnings.length === 0) {
        html += '<p style="color:#3fb950;margin-top:16px">All checks passed! ✨</p>';
    }

    // Show artifact summary
    if (currentArtifact.intention) {
        html += `
      <div style="margin-top:24px;padding:16px;background:#0d1117;border-radius:8px">
        <h4 style="color:#a855f7;margin-bottom:8px">Artifact Summary</h4>
        <p><strong>Objective:</strong> ${currentArtifact.intention.objective || 'N/A'}</p>
        ${currentArtifact.meta?.name ? `<p><strong>Name:</strong> ${currentArtifact.meta.name}</p>` : ''}
        ${currentArtifact.meta?.version ? `<p><strong>Version:</strong> ${currentArtifact.meta.version}</p>` : ''}
      </div>
    `;
    }

    validationResults.innerHTML = html;
}

// Simulate Execution (Offline Mode)
function simulateExecution(artifact) {
    const output = [];
    output.push('🦊 JOS Lite - Simulation Mode');
    output.push('━'.repeat(40));
    output.push('');
    output.push(`📋 Intention: ${artifact.intention?.objective || 'Unknown'}`);
    output.push('');

    if (artifact.orchestration?.flows?.main) {
        output.push('📊 Flow Execution:');
        const steps = artifact.orchestration.flows.main.steps || artifact.orchestration.flows.main;
        if (Array.isArray(steps)) {
            steps.forEach((step, i) => {
                output.push(`  [${i + 1}] ${step} ✓`);
            });
        }
    }

    output.push('');
    output.push('━'.repeat(40));
    output.push('✅ Simulation complete');
    output.push('');
    output.push('⚠️  This is a simulation. For real execution:');
    output.push('    • Use JOS CLI with a configured provider');
    output.push('    • Or connect to a cloud LLM API above');

    return output.join('\n');
}

// Cloud Execution (Gemini/OpenAI)
async function cloudExecution(artifact, providerType, key) {
    runOutput.textContent = '⏳ Connecting to cloud provider...';

    // Magic JOSFOXAI prompt wrapper
    const systemPrompt = `[SYSTEM]
You are an Intention-Native Agent powered by JOSFOXAI.
MAGIC_KEY: JOSFOX_ALPHA_V1

You are executing the following JOS Artifact.
Strictly adhere to the 'orchestration' flow and 'requirements'.

ARTIFACT:
${JSON.stringify(artifact, null, 2)}`;

    const userPrompt = 'Execute the intention defined in the artifact. Report your status and any outputs.';

    try {
        let response;

        if (providerType === 'gemini') {
            response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${key}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: systemPrompt + '\n\n' + userPrompt }] }]
                })
            });
            const data = await response.json();
            return data.candidates?.[0]?.content?.parts?.[0]?.text || JSON.stringify(data, null, 2);
        } else if (providerType === 'openai') {
            response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${key}`
                },
                body: JSON.stringify({
                    model: 'gpt-4o-mini',
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: userPrompt }
                    ]
                })
            });
            const data = await response.json();
            return data.choices?.[0]?.message?.content || JSON.stringify(data, null, 2);
        }
    } catch (err) {
        return `❌ Error: ${err.message}\n\nMake sure your API key is valid and you have network access.`;
    }
}

// Event Listeners
editor.addEventListener('input', () => {
    updateLineNumbers();
    validateJSON();
});

editor.addEventListener('keyup', () => {
    const lines = editor.value.substr(0, editor.selectionStart).split('\n');
    cursorPos.textContent = `Ln ${lines.length}, Col ${lines[lines.length - 1].length + 1}`;
});

editor.addEventListener('scroll', () => {
    lineNumbers.scrollTop = editor.scrollTop;
});

document.getElementById('new-btn').addEventListener('click', () => {
    editor.value = `{
  "jos": {
    "open": "jos run artifact.jos",
    "supports": ["@josfox/jos"]
  },
  "meta": {
    "name": "New Artifact",
    "version": "1.0.0",
    "type": "task"
  },
  "intention": {
    "objective": "Your goal here",
    "success_criteria": "How you know it worked"
  },
  "orchestration": {
    "contracts": { "version": "0.0.7", "mode": "sync" },
    "flows": {
      "main": {
        "steps": ["step1", "step2"]
      }
    }
  },
  "guardrails": {
    "max_retries": 3,
    "timeout_ms": 30000
  }
}`;
    currentFile = 'untitled.jos';
    fileName.textContent = currentFile;
    updateLineNumbers();
    validateJSON();
});

document.getElementById('open-btn').addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    currentFile = file.name;
    fileName.textContent = currentFile;

    const reader = new FileReader();
    reader.onload = (event) => {
        editor.value = event.target.result;
        updateLineNumbers();
        validateJSON();
        updateValidationPanel();
    };
    reader.readAsText(file);
});

document.getElementById('save-btn').addEventListener('click', () => {
    const blob = new Blob([editor.value], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentFile;
    a.click();
    URL.revokeObjectURL(url);
});

provider.addEventListener('change', () => {
    apiKeySection.style.display = provider.value === 'simulation' ? 'none' : 'block';
});

document.getElementById('run-btn').addEventListener('click', async () => {
    if (!currentArtifact) {
        runOutput.textContent = '❌ No valid artifact loaded. Please load a .jos file first.';
        return;
    }

    if (provider.value === 'simulation') {
        runOutput.textContent = simulateExecution(currentArtifact);
    } else {
        if (!apiKey.value) {
            runOutput.textContent = '❌ Please enter your API key.';
            return;
        }
        runOutput.textContent = await cloudExecution(currentArtifact, provider.value, apiKey.value);
    }
});

// Offline detection
window.addEventListener('online', () => {
    offlineStatus.textContent = '🟢 Online';
});

window.addEventListener('offline', () => {
    offlineStatus.textContent = '🔴 Offline';
});

// Initialize
updateLineNumbers();
validateJSON();
