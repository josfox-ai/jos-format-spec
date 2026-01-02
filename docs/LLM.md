# .jos Format Specification — LLM Reference

> **For AI Agents**: This document is optimized for machine consumption. Use it to understand, generate, and validate `.jos` artifacts.

---

## Overview

The `.jos` format is the **minimum viable unit of intelligent automation** — portable, verifiable, reproducible.

**Key Insight**: Behind every prompt is an intention. The `.jos` format captures that intention with:
- ✅ Success criteria (how to know if it worked)
- ✅ Guardrails (what NOT to do)
- ✅ Fallback strategies (what to do when it fails)
- ✅ Audit trail (what actually happened)

---

## Core Principles

```
Universe → Intention → Prompt → Execution → Result
```

`.jos` operates at the **intention layer** — above prompts, below goals.

---

## Dual-Kernel Architecture

Every `.jos` artifact contains two complementary kernels:

### JOSFOXAI Kernel (Metadata)
```json
{
  "JOSFOXAI": {
    "os": "JOSFOXAI-Kernel",
    "os_version": "1.0.0",
    "format_version": "0.0.7",
    "spec_maturity": "0.1.0-alpha",
    "agent_name": "Your-Agent-Name",
    "created_at": "2024-01-01T00:00:00Z",
    "modified_at": "2024-01-01T00:00:00Z"
  }
}
```

### MAGIC Kernel (Intent)
```json
{
  "MAGIC": {
    "intention": "What you want to achieve in plain English",
    "guardrails": ["things-to-avoid", "constraints"],
    "success_criteria": "How to verify success",
    "failure_action": "rollback | notify | retry",
    "max_retries": 3
  }
}
```

---

## Minimal Valid Artifact

```json
{
  "JOSFOXAI": {
    "os": "JOSFOXAI-Kernel",
    "os_version": "1.0.0",
    "format_version": "0.0.7",
    "spec_maturity": "0.1.0-alpha",
    "agent_name": "example-agent",
    "created_at": "2024-01-01T00:00:00Z",
    "modified_at": "2024-01-01T00:00:00Z"
  },
  "MAGIC": {
    "intention": "Describe what this artifact does",
    "guardrails": [],
    "success_criteria": "How to know it worked",
    "failure_action": "notify",
    "max_retries": 1
  },
  "id_jos": "unique-artifact-id",
  "name": "Artifact Name",
  "version": "1.0.0"
}
```

---

## Full Schema

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `JOSFOXAI` | object | Metadata kernel |
| `MAGIC` | object | Intent kernel |
| `id_jos` | string | Unique identifier |
| `name` | string | Human-readable name |
| `version` | string | Semantic version |

### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `description` | string | Detailed description |
| `author` | string | Creator/maintainer |
| `license` | string | License identifier |
| `security` | object | Integrity and access control |
| `orchestration` | object | Task definitions and flows |
| `environment` | object | Environment variables |
| `x_run_params` | object | Execution parameters |
| `meta` | object | Additional metadata |

---

## Orchestration Block

For executable artifacts, the `orchestration` block defines tasks:

```json
{
  "orchestration": {
    "definitions": {
      "task_name": {
        "type": "shell | jos | http | function",
        "command": "shell command or reference",
        "description": "What this task does"
      }
    },
    "flows": {
      "main": {
        "description": "Default execution flow",
        "steps": ["task_1", "task_2", "task_3"]
      }
    }
  }
}
```

### Task Types

| Type | Description | Example |
|------|-------------|---------|
| `shell` | Execute shell command | `"npm install"` |
| `jos` | Execute sub-artifact | `"./sub-task.jos"` |
| `http` | HTTP request | `{ "url": "...", "method": "POST" }` |
| `function` | JS function call | `"myFunction()"` |

---

## Integrity Verification

`.jos` artifacts use **detached manifests** for cryptographic integrity:

```
artifact.jos       ← The artifact
artifact.jos.sig.json  ← SHA-256 hash + metadata
```

Manifest structure:
```json
{
  "artifact_sha256": "abc123...",
  "generated_at": "2024-01-01T00:00:00Z",
  "generator": "jos-cli"
}
```

Reference in artifact:
```json
{
  "security": {
    "type": "open",
    "integrity_ref": "./artifact.jos.sig.json"
  }
}
```

---

## Generating .jos Artifacts

### From Plain Text Intention

Input:
```
"Deploy my Next.js app to Vercel with preview on PRs"
```

Output artifact:
```json
{
  "JOSFOXAI": { ... },
  "MAGIC": {
    "intention": "Deploy Next.js application to Vercel with automatic preview deployments on pull requests",
    "guardrails": ["no-production-deploy-on-pr", "require-build-success"],
    "success_criteria": "Preview URL returned and accessible",
    "failure_action": "notify",
    "max_retries": 2
  },
  "orchestration": {
    "definitions": {
      "build": {
        "type": "shell",
        "command": "npm run build"
      },
      "deploy_preview": {
        "type": "shell", 
        "command": "vercel --confirm"
      }
    },
    "flows": {
      "main": {
        "steps": ["build", "deploy_preview"]
      }
    }
  }
}
```

---

## Validation Rules

When validating a `.jos` artifact, check:

1. **JSON Syntax** — Valid JSON
2. **JOSFOXAI Keys** — All 8 required keys present
3. **MAGIC Keys** — All 5 required keys present
4. **Unique ID** — `id_jos` is unique
5. **Integrity** — SHA-256 matches manifest (if present)

---

## CLI Commands

```bash
# Create new artifact
jos init my-artifact --pipeline

# Add task
jos add task_name my-artifact.jos --command "echo hello"

# Validate
jos validate my-artifact.jos

# Execute
jos run my-artifact.jos --flow main

# Dry run
jos run my-artifact.jos --dry-run
```

---

## Industry Standards Compatibility

| Standard | Relationship |
|----------|-------------|
| **A2A Protocol** | `.jos` artifacts can be exchanged as A2A Tasks |
| **MCP (Anthropic)** | `.jos` guardrails can define MCP tool access policies |
| **AGENTS.md** | `.jos` extends AGENTS.md with success criteria and guardrails |

---

## Version Information

```
Format Version: 0.0.7
Specification Maturity: 0.1.0 (Alpha)
```

---

## License

The `.jos` specification is **open source** under MIT License.

**JOSFOX Cloud** (https://josfox.cloud) is the first commercial implementation.

---

## Links

- Specification: https://github.com/josfox-ai/jos
- npm packages: `@josfox/jos`, `@josfox/jos-cli`, `josctl`
- Cloud: https://josfox.cloud

---

*This document is LLM-optimized. Pass it as context when working with .jos artifacts.*
