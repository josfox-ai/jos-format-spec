# .jos LLM Implementation Guide

**For AI Agents, Coding Assistants, and Autonomous Systems**

*Format version v0.0.7 — Specification maturity v0.1.0 (Alpha)*

---

## Quick Reference

```
.jos = portable AI automation artifact
MAGIC = semantic kernel (intention, guardrails, success criteria)
JOSFOXAI = operational kernel (orchestration, security, execution)
```

---

## CLI Commands

### `jos run`

Execute a .jos artifact.

```bash
jos run <artifact.jos> [--flow <name>] [--dry-run] [--insecure]
```

**LLM Usage:** When user asks to "run" or "execute" an artifact:
```bash
jos run deploy.jos --flow main
```

---

### `jos validate`

Validate artifact schema and integrity.

```bash
jos validate <artifact.jos>
```

**LLM Usage:** Before running, validate the artifact:
```bash
jos validate my-task.jos
```

---

### `jos init`

Create new artifact from template.

```bash
jos init <name> [--pipeline]
```

**LLM Usage:** To create a new automation:
```bash
jos init deploy-app --pipeline
```

---

### `jos prompts`

Prompt optimization via API.

```bash
jos prompts optimize <artifact.jos> --model gpt-4o-2024
jos prompts validate <artifact.jos>
jos prompts generate "<intention>" --output <file.jos>
```

**LLM Usage:** To improve prompt quality:
```bash
jos prompts optimize my-task.jos --model gpt-4o-2024
```

---

### `jos serve`

Start development server with dashboard.

```bash
jos serve [--port <number>]
```

---

### `jos secrets`

Manage encrypted credentials (AES-256).

```bash
jos secrets set <KEY> <value>
jos secrets get <KEY>
jos secrets list
```

---

### `josctl`

Orchestration controller for pipelines.

```bash
josctl run <artifact.jos>
josctl validate <artifact.jos>
josctl orchestration
```

---

## Minimal Valid Artifact

```json
{
  "jos": {
    "open": "jos run atom",
    "supports": ["@josfox/jos", "josctl"]
  },
  "orchestration_contract": {
    "version": "0.0.7",
    "mode": "sync"
  },
  "security": {
    "type": "open",
    "permissions": [],
    "health_check": null,
    "integrity": null
  },
  "files": [],
  "orchestration": {
    "state": { "current_status": "idle" },
    "definitions": {
      "main_task": {
        "type": "shell",
        "command": "echo 'Hello from .jos'"
      }
    },
    "flows": {
      "main": {
        "steps": ["main_task"]
      }
    }
  },
  "meta": {
    "version": "1.0.0",
    "type": "atom",
    "name": "example",
    "provider": "local"
  },
  "artifacts": {
    "description": "Minimal example artifact"
  },
  "guardrails": {
    "avoid": [],
    "max_retries": 0
  },
  "intention": {
    "objective": "Demonstrate a valid .jos file",
    "success_criteria": "Schema validation passes"
  },
  "capabilities": ["demo"]
}
```

---

## Task Types

| Type | Description | Command Format |
|------|-------------|----------------|
| `shell` | Execute shell command | `"command": "npm install"` |
| `jos` | Execute sub-artifact | `"artifact": "./sub.jos"` |
| `http` | HTTP request | `"url": "...", "method": "POST"` |
| `function` | JS function call | `"function": "myFunc()"` |

---

## A2A Protocol Integration

### .jos as A2A Task Payload

A2A (Agent-to-Agent) protocol defines agent communication. `.jos` artifacts serve as **task payloads**:

```json
{
  "jsonrpc": "2.0",
  "method": "tasks/send",
  "params": {
    "task": {
      "name": "deploy-application",
      "payload": {
        "type": "application/jos",
        "artifact": {
          "jos": { "open": "jos run atom" },
          "orchestration_contract": { "version": "0.0.7" },
          "intention": {
            "objective": "Deploy Next.js to Vercel",
            "success_criteria": "Deployment URL returns 200"
          },
          "guardrails": {
            "avoid": ["production-deploy-without-tests"],
            "max_retries": 2
          },
          "orchestration": {
            "definitions": {
              "build": { "type": "shell", "command": "npm run build" },
              "deploy": { "type": "shell", "command": "vercel --prod" }
            },
            "flows": {
              "main": { "steps": ["build", "deploy"] }
            }
          }
        }
      }
    }
  }
}
```

### A2A Agent Card with .jos Capability

Declare .jos support in Agent Card:

```json
{
  "name": "deployment-agent",
  "description": "Handles deployment workflows",
  "capabilities": {
    "formats": ["application/jos"],
    "jos_version": "0.0.7",
    "supported_types": ["atom", "pipeline"]
  },
  "skills": [
    {
      "name": "execute-jos",
      "description": "Execute .jos artifacts",
      "inputSchema": {
        "type": "object",
        "properties": {
          "artifact": { "type": "object", "description": ".jos artifact" },
          "flow": { "type": "string", "default": "main" }
        }
      }
    }
  ]
}
```

### A2A Task Response with .jos Result

```json
{
  "jsonrpc": "2.0",
  "id": "task-123",
  "result": {
    "status": "completed",
    "artifacts": [
      {
        "type": "application/jos",
        "artifact": { /* updated .jos with execution results */ },
        "execution_log": {
          "steps_completed": ["build", "deploy"],
          "success_criteria_met": true,
          "witness_ref": "~/.jos/runs/2025-12-28T19-30-00"
        }
      }
    ]
  }
}
```

---

## MCP (Model Context Protocol) Integration

### .jos Guardrails as MCP Tool Policies

Use `.jos` guardrails to define MCP tool access policies:

```json
{
  "tools": [
    {
      "name": "execute_artifact",
      "description": "Execute a .jos artifact",
      "inputSchema": {
        "type": "object",
        "properties": {
          "artifact_path": { "type": "string" },
          "flow": { "type": "string", "default": "main" }
        }
      }
    }
  ]
}
```

### MCP Server Serving .jos Artifacts

```javascript
// MCP server exposing .jos execution
const server = new McpServer({
  name: "jos-executor",
  version: "1.0.0"
});

server.tool(
  "execute_jos",
  {
    artifact: { type: "object", description: ".jos artifact" },
    flow: { type: "string", default: "main" },
    dry_run: { type: "boolean", default: false }
  },
  async ({ artifact, flow, dry_run }) => {
    // Validate guardrails
    if (artifact.guardrails?.avoid?.includes("dangerous-operation")) {
      throw new Error("Guardrail violation: dangerous-operation");
    }
    
    // Execute via jos CLI
    const result = await executeJos(artifact, flow, dry_run);
    
    return {
      success: result.success_criteria_met,
      steps_completed: result.steps,
      witness_log: result.witness_ref
    };
  }
);
```

### Guardrails to MCP Permissions Mapping

```json
{
  "guardrails": {
    "avoid": [
      "no-file-write",
      "no-network-requests",
      "no-shell-execution"
    ]
  }
}
```

Maps to MCP permissions:
```json
{
  "permissions": {
    "filesystem": { "write": false },
    "network": { "outbound": false },
    "shell": { "execute": false }
  }
}
```

---

## Generating .jos from Intention

### Input (Natural Language)

```
"Deploy my Next.js app to Vercel with preview on PRs"
```

### Output (.jos Artifact)

```json
{
  "jos": { "open": "jos run pipeline", "supports": ["@josfox/jos"] },
  "orchestration_contract": { "version": "0.0.7", "mode": "sync" },
  "meta": {
    "name": "deploy-nextjs-vercel",
    "version": "1.0.0",
    "type": "pipeline"
  },
  "intention": {
    "objective": "Deploy Next.js application to Vercel with automatic preview deployments on pull requests",
    "success_criteria": "Preview URL returned and accessible with HTTP 200"
  },
  "guardrails": {
    "avoid": ["production-deploy-on-pr", "deploy-without-build"],
    "max_retries": 2
  },
  "orchestration": {
    "definitions": {
      "install": {
        "type": "shell",
        "command": "npm ci",
        "description": "Install dependencies"
      },
      "build": {
        "type": "shell",
        "command": "npm run build",
        "description": "Build production bundle"
      },
      "deploy_preview": {
        "type": "shell",
        "command": "vercel --confirm",
        "description": "Deploy to Vercel preview"
      },
      "verify": {
        "type": "shell",
        "command": "curl -sf $VERCEL_URL || exit 1",
        "description": "Verify deployment is accessible"
      }
    },
    "flows": {
      "main": {
        "description": "Full deployment pipeline",
        "steps": ["install", "build", "deploy_preview", "verify"]
      }
    }
  },
  "security": { "type": "open", "permissions": ["network:outbound", "fs:read"] },
  "files": [],
  "artifacts": { "description": "Vercel deployment pipeline for Next.js" },
  "capabilities": ["deploy", "ci-cd", "vercel"]
}
```

---

## Validation Checklist

When validating a .jos artifact:

1. ✅ Valid JSON syntax
2. ✅ `jos` object present with `open` and `supports`
3. ✅ `orchestration_contract.version` is "0.0.7"
4. ✅ `meta` has `name`, `version`, `type`
5. ✅ `intention` has `objective` and `success_criteria`
6. ✅ `guardrails` has `avoid` (array) and `max_retries` (number)
7. ✅ `orchestration.flows` has at least one flow
8. ✅ All steps in flows reference definitions
9. ✅ If `security.integrity_ref` present, verify SHA-256

---

## Links

- Specification: https://github.com/josfox-ai/jos-format-spec
- npm: `npm install -g @josfox/jos`
- API Spec: [PROMPTS_API.md](./PROMPTS_API.md)

---

*This document is LLM-optimized. Pass it as context when working with .jos artifacts.*
