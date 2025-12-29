<div align="center">

```
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⡀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣾⠙⠻⢶⣄⡀⠀⠀⠀⢀⣤⠶⠛⠛⡇⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢹⣇⠀⠀⣙⣿⣦⣤⣴⣿⣁⠀⠀⣸⠇⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⣡⣾⣿⣿⣿⣿⣿⣿⣿⣷⣌⠋⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣴⣿⣷⣄⡈⢻⣿⡟⢁⣠⣾⣿⣦⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢹⣿⣿⣿⣿⠘⣿⠃⣿⣿⣿⣿⡏⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⠀⠈⠛⣰⠿⣆⠛⠁⠀⡀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣼⣿⣦⠀⠘⠛⠋⠀⣴⣿⠁⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣤⣶⣾⣿⣿⣿⣿⡇⠀⠀⠀⢸⣿⣏⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣠⣶⣿⣿⣿⣿⣿⣿⣿⣿⠿⠿⠀⠀⠀⠾⢿⣿⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⣠⣿⣿⣿⣿⣿⣿⡿⠟⠋⣁⣠⣤⣤⡶⠶⠶⣤⣄⠈⠀⠀⠀⠀⠀⠀
⠀⠀⠀⢰⣿⣿⣮⣉⣉⣉⣤⣴⣶⣿⣿⣋⡥⠄⠀⠀⠀⠀⠉⢻⣄⠀⠀⠀⠀⠀
⠀⠀⠀⠸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣟⣋⣁⣤⣀⣀⣤⣤⣤⣤⣄⣿⡄⠀⠀⠀⠀
⠀⠀⠀⠀⠙⠿⣿⣿⣿⣿⣿⣿⣿⡿⠿⠛⠋⠉⠁⠀⠀⠀⠀⠈⠛⠃⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠉⠉⠉⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
```

# .jos Open Standard

**Made with ❤️ & AI**

*Managed by the JOS Open Standards Foundation*

[![Version](https://img.shields.io/badge/format-v0.0.7-00ffff?style=for-the-badge)](https://github.com/josfox-ai/jos-format-spec)
[![Spec](https://img.shields.io/badge/spec-v0.1.0--alpha-ff69b4?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-Open-success?style=for-the-badge)](#license)

</div>

---

## What is .jos?

**.jos** is an open standard that defines a **single portable artifact** designed to move across tools, runtimes, and agent ecosystems without losing:

| Aspect | Description |
|--------|-------------|
| **Meaning** | Intent (what it's supposed to do) |
| **Safety** | Guardrails & security constraints |
| **Execution** | How it runs (pipelines, tasks, flows) |
| **Verifiability** | Success criteria + integrity hash |

> **Reference implementation & spec**: [josfox-ai/jos-format-spec](https://github.com/josfox-ai/jos-format-spec)

---

## Core Concept

A `.jos` file is a **file-based representation of automated, composable, transactional, abstract logic**.

It is intentionally **LLM/AI-friendly**:

- ✅ Minimal required keys
- ✅ Explicit success criteria
- ✅ Explicit constraints/guardrails
- ✅ Portable orchestration model
- ✅ Machine-validatable schema

> **.jos is not "just a prompt" and not "just config".**  
> It is the **minimum atomic unit** that carries **Intention + Execution** together.

---

## Why .jos Exists

### 1️⃣ Portable "Intent that Executes"

Most systems separate:
- **Intention** (docs, prompts, tickets)
- **Execution** (pipelines, scripts, vendor configs)

This breaks portability. **.jos binds both into one artifact.**

### 2️⃣ Universal "Definition of Done"

Agents and pipelines often fail because "done" is ambiguous.

**.jos makes "done" explicit** via:
- `intention.success_criteria`
- `guardrails`
- Machine validation + integrity hooks

### 3️⃣ Fractal Composition

The same contract works for:
- An atom (single task)
- A pipeline (sequence of tasks)
- A service (long-running)
- A business (organization-wide)

Because **.jos composes recursively** through `files[]` + `orchestration`.

### 4️⃣ Security is Not Optional

.jos elevates security and integrity to **top-level requirements**:
- Permissions model
- Health check expectations
- Integrity hash expectation

---

## The MAGIC + JOSFOXAI Contract

A valid `.jos` file **MUST** contain both:

| MAGIC (Intention) | JOSFOXAI (Execution) |
|-------------------|----------------------|
| `meta` | `jos` |
| `artifacts` | `orchestration_contract` |
| `guardrails` | `security` |
| `intention` | `files` |
| `capabilities` | `orchestration` |

**The Dual-Kernel Law:**
- MAGIC without JOSFOXAI → **inert** (knows what, can't do)
- JOSFOXAI without MAGIC → **blind** (can do, doesn't know what)

---

## Minimal Valid Example (v0.0.7)

```json
{
  "jos": {
    "open": "jos run atom",
    "supports": ["jos-cli"]
  },
  "orchestration_contract": {
    "version": "0.0.7",
    "mode": "sync"
  },
  "security": {
    "type": "open",
    "permissions": [],
    "health_check": "http://localhost/health",
    "integrity": "sha256-aaaa..."
  },
  "files": [],
  "orchestration": {
    "state": { "current_status": "idle" },
    "definitions": {},
    "flows": {}
  },
  "meta": {
    "version": "1.0.0",
    "type": "atom",
    "name": "example",
    "provider": "local"
  },
  "artifacts": {
    "description": "Minimal example"
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

## A2A Protocol Alignment

[A2A (Agent2Agent)](https://a2aprotocol.ai) is an open protocol for agent interoperability.

| Protocol | Purpose |
|----------|---------|
| **A2A** | Wire protocol (agents talking to agents) |
| **.jos** | Portable executable artifact (what agents exchange) |

**How they fit together:**
- A2A moves tasks/messages between agents
- .jos is the standard payload that can be transported, validated, and executed anywhere

This makes .jos excellent for:
- **A2A Task payloads** — send .jos, get run results/events back
- **A2A AgentCard capability declarations** — "this agent accepts .jos artifacts"

---

## Governance

The **JOS Open Standards Foundation** exists to keep .jos:

- 🔓 **Open** — Free to use, implement, and extend
- 🧩 **Composable** — Builds on itself recursively
- 🔌 **Implementation-agnostic** — Works with any runtime
- 📐 **Stable** — Reliable across ecosystems

---

## How to Cite

Add this to your README if you implement .jos:

```markdown
## .jos Open Standard

This project implements the [.jos Open Standard](https://github.com/josfox-ai/jos-format-spec) 
managed by the JOS Open Standards Foundation.

Version: v0.0.7-alpha
```

---

## License

**Status: ALPHA (v0.0.7)**

This standard and any reference tooling are provided **"AS IS"**, without warranty.

- ✅ Free to use, including commercial use
- ✅ No liability, no responsibility
- ⚠️ **Must cite** the JOS Open Standards Foundation if you implement the standard

---

<div align="center">

**Made with ❤️ & AI**

*JOS Open Standards Foundation*

</div>
