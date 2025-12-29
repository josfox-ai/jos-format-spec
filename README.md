# .jos — The Intention Format

> **Prompts fail. Intentions don't.**

The `.jos` specification is the **minimum viable unit of intelligent automation** — portable, verifiable, reproducible.

[![npm](https://img.shields.io/npm/v/@josfox/jos.svg)](https://www.npmjs.com/package/@josfox/jos)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Alpha](https://img.shields.io/badge/status-alpha-orange.svg)](https://josfox.cloud)

---

## The Problem

Today's AI treats prompts as strings of text. This leads to predictable failures:

| Problem | Impact |
|---------|--------|
| **Brittle automations** | Minor changes cause unpredictable behavior |
| **Poor reproducibility** | Same prompt, different outcomes |
| **Unclear success criteria** | No way to measure if AI "succeeded" |
| **Prompt rot** | Prompts drift over time, context is lost |
| **Massive variance** | 40-60% variance in outcomes from "similar" prompts |
| **No portability** | Vendor lock-in, no standard format |

**Failures are rarely model failures. They are intent failures.**

---

## The Solution

Behind every prompt is an intention. `.jos` captures that intention with:

```
Universe → Intention → Prompt → Execution → Result
```

A `.jos` artifact includes:
- ✅ **What** you want to achieve (intention)
- ✅ **How** to verify success (success criteria)
- ✅ **What NOT** to do (guardrails)
- ✅ **What to do** when it fails (fallback strategies)
- ✅ **What happened** (audit trail)

---

## Quick Start

```bash
# Install
npm install -g @josfox/jos

# Create artifact
jos init my-task --pipeline

# Validate
jos validate my-task.jos

# Execute
jos run my-task.jos
```

---

## Minimal Artifact

```json
{
  "JOSFOXAI": {
    "os": "JOSFOXAI-Kernel",
    "os_version": "1.0.0",
    "format_version": "0.0.7",
    "spec_maturity": "0.1.0-alpha",
    "agent_name": "my-agent",
    "created_at": "2024-01-01T00:00:00Z",
    "modified_at": "2024-01-01T00:00:00Z"
  },
  "MAGIC": {
    "intention": "Deploy application to production",
    "guardrails": ["no-force-push", "require-tests-pass"],
    "success_criteria": "Deployment URL accessible and returning 200",
    "failure_action": "rollback",
    "max_retries": 2
  },
  "id_jos": "deploy-prod-v1",
  "name": "Production Deployment",
  "version": "1.0.0"
}
```

---

## Industry Standards Compatibility

`.jos` sits at the **intention layer** — complementing, not competing with, execution and communication standards.

| Standard | Relationship |
|----------|-------------|
| **A2A Protocol** | `.jos` artifacts can be exchanged as A2A Tasks |
| **MCP (Anthropic)** | `.jos` guardrails can define MCP tool access policies |
| **AGENTS.md** | `.jos` extends AGENTS.md with success criteria |

---

## Packages

| Package | Description |
|---------|-------------|
| [`@josfox/jos`](https://www.npmjs.com/package/@josfox/jos) | Core kernel — validate, run, create |
| [`@josfox/jos-cli`](https://www.npmjs.com/package/@josfox/jos-cli) | CLI with JOSFOX Internet captive portal |
| [`josctl`](https://www.npmjs.com/package/josctl) | Orchestration controller |
| [`josfox`](https://www.npmjs.com/package/josfox) | Alias for quick access |

---

## Documentation

| Document | Description |
|----------|-------------|
| [SPECIFICATION.md](./jos/SPECIFICATION.md) | Full technical specification |
| [LLM.md](./LLM.md) | LLM-friendly reference (pass to AI agents) |
| [Examples](./jos/examples/) | Real-world artifact examples |

---

## The Standard vs. The Implementation

> ⚠️ **Important Distinction**

The `.jos` specification is **free and open source** (MIT License).

**[JOSFOX Cloud](https://josfox.cloud)** is the first commercial implementation, offering:
- FOXTANA Intent Engine (intention → artifact)
- Crystallize Engine (artifact execution)
- Cloud dashboard and analytics
- Enterprise features

You can build your own `.jos` runtime. The format is vendor-unlocked.

---

## Version

```
Format Version: 0.0.7
Specification Maturity: 0.1.0 (Alpha)
```

See [CHANGELOG.md](./CHANGELOG.md) for version history.

---

## Contributing

We welcome contributions! See [CONTRIBUTING.md](./CONTRIBUTING.md).

---

## License

MIT License — The `.jos` specification is free to use, modify, and distribute.

---

## Links

- **Specification**: https://github.com/josfox-ai/jos
- **Cloud Implementation**: https://josfox.cloud
- **npm**: `npm install -g @josfox/jos`

---

*Format version v0.0.7 — Specification maturity v0.1.0 (Alpha)*
