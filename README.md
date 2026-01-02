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

## The Intention Format for AI Automation

**Format version v0.0.7 — Specification maturity v0.1.0 (Alpha)**

[![npm](https://img.shields.io/npm/v/@josfox/jos.svg)](https://www.npmjs.com/package/@josfox/jos)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Alpha](https://img.shields.io/badge/status-alpha-orange.svg)](#)

*Managed by the JOS Open Standards Foundation*

</div>

---

## Abstract

The **.jos Open Standard** defines a portable, self-describing artifact format for encoding **intention** and **execution** as a single atomic unit. Unlike prompts (which lack execution semantics), pipelines (which lack success criteria), or vendor-specific configurations (which lack portability), a `.jos` artifact contains everything required to understand, validate, and execute an automated task across any compliant runtime.

The standard introduces a **dual-kernel architecture**: every valid artifact contains both a **semantic kernel** (MAGIC) defining intention, success criteria, and constraints, and an **operational kernel** (JOSFOXAI) defining execution pathways and security boundaries. This separation enables fractal composition — the same schema describes atoms, pipelines, services, and organizations without translation.

> **Prompts fail. Intentions don't.**

---

## Table of Contents

1. [The Problem](#1-the-problem)
2. [The Solution](#2-the-solution)
3. [History & Evolution](#3-history--evolution)
4. [Core Concepts](#4-core-concepts)
5. [Comparison with Related Work](#5-comparison-with-related-work)
6. [Benefits](#6-benefits)
7. [CLI Tools](#7-cli-tools)
8. [When to Use .jos](#8-when-to-use-jos)
9. [Getting Started](#9-getting-started)
10. [Roadmap](#10-roadmap)
11. [Citation](#11-citation)
12. [License & Governance](#12-license--governance)

---

## 1. The Problem

Modern AI automation suffers from systemic fragmentation:

| Problem | Manifestation | Impact |
|---------|--------------|--------|
| **Intent Opacity** | Prompts encode what to do, not why or how to verify | 40-60% outcome variance from "similar" prompts |
| **Success Ambiguity** | No machine-readable definition of "done" | Agents loop indefinitely or declare false success |
| **Prompt Rot** | Context drifts as prompts evolve | Automations degrade silently over time |
| **Vendor Lock-in** | Each platform requires proprietary formats | No portability between tools or organizations |
| **Composition Failure** | Pipelines don't compose with pipelines | Exponential complexity at scale |

**Root cause:** Current approaches treat automation as *configuration* rather than *specification*. A prompt is not a contract. A YAML file is not an intention.

---

## 2. The Solution

The `.jos` standard addresses these failures by defining a **complete representation of automated logic**:

```
Universe → Intention → Prompt → Execution → Result
                ↑
           .jos operates here
```

A `.jos` artifact encodes:

| Component | Purpose |
|-----------|---------|
| **Intention** | What to achieve (human-readable objective) |
| **Success Criteria** | How to verify completion (machine-evaluable) |
| **Guardrails** | What NOT to do (constraints and prohibitions) |
| **Orchestration** | How to execute (steps, flows, dependencies) |
| **Security** | Who can run, with what permissions |
| **Integrity** | Cryptographic verification (SHA-256 manifests) |

---

## 3. History & Evolution

### Genesis (2024)

The `.jos` format emerged from observing failure patterns in production AI systems:

- Enterprise chatbots that "worked" in demos but failed in deployment
- Automation pipelines that required constant human intervention
- Agents that completed tasks incorrectly without knowing they had failed

### Design Principles

The standard was designed around three invariants:

1. **Intention First** — Every artifact begins with a clear objective
2. **Verification Built-In** — Success criteria are mandatory, not optional
3. **Fractal Composition** — Same schema at all scales

### Evolution

| Version | Date | Milestone |
|---------|------|-----------|
| v0.0.1 | 2024-12 | Initial schema definition |
| v0.0.4 | 2024-12 | npm packages published |
| v0.0.5 | 2024-12 | Detached integrity manifests |
| v0.0.6 | 2024-12 | Witness logging, josctl |
| v0.0.7 | 2025-12 | Prompts API, LLMs.md, A2A/MCP integration |

---

## 4. Core Concepts

### 4.1 Dual-Kernel Architecture

Every `.jos` artifact contains two complementary kernels:

```
┌─────────────────────────────────────────────────────────┐
│                    .jos Artifact                        │
│  ┌─────────────────────┐  ┌─────────────────────────┐  │
│  │   MAGIC Kernel      │  │   JOSFOXAI Kernel       │  │
│  │   (Semantic)        │  │   (Operational)         │  │
│  │                     │  │                         │  │
│  │  • intention        │  │  • jos                  │  │
│  │  • guardrails       │  │  • orchestration_contract│ │
│  │  • artifacts        │  │  • security             │  │
│  │  • capabilities     │  │  • orchestration        │  │
│  │  • meta             │  │  • files                │  │
│  └─────────────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**The Dual-Kernel Law:**
- MAGIC without JOSFOXAI is **inert** — knows what to do but cannot act
- JOSFOXAI without MAGIC is **blind** — can act but doesn't know what success means

### 4.2 Fractal Composition

The `.jos` schema exhibits recursive self-similarity:

| Level | Description | Same Schema? |
|-------|-------------|--------------|
| Atom | Single executable task | ✅ |
| Pipeline | Sequence of tasks | ✅ |
| Service | Long-running pipeline | ✅ |
| Organization | Namespace of services | ✅ |

Composition via `files[]` is type-preserving and context-aware.

### 4.3 Intention Layer

```
┌───────────────────────────────────────┐
│              Goals                    │  (Human objectives)
├───────────────────────────────────────┤
│         ══ Intention Layer ══         │  ← .jos operates here
│     (Success criteria, guardrails)    │
├───────────────────────────────────────┤
│              Prompts                  │  (LLM inputs)
├───────────────────────────────────────┤
│            Execution                  │  (Runtime behavior)
└───────────────────────────────────────┘
```

---

## 5. Comparison with Related Work

### 5.1 Protocol Positioning

| Protocol | Layer | Function | Relationship to .jos |
|----------|-------|----------|---------------------|
| **A2A** (Google) | Transport | Agent-to-agent communication | .jos as A2A Task **payload** |
| **MCP** (Anthropic) | Tool Access | Model-tool invocation | .jos guardrails as MCP **policies** |
| **AGENTS.md** | Documentation | Agent capability description | .jos **extends** with execution semantics |

### 5.2 Complementary, Not Competing

```
A2A Protocol     → How agents discover and talk to each other
MCP              → How agents invoke tools
.jos             → What agents exchange and execute
```

### 5.3 Technical Differentiation

| Property | .jos | Prompts | YAML Pipelines | LangChain |
|----------|------|---------|----------------|-----------|
| Portable across vendors | ✅ | ✅ | ❌ | ❌ |
| Machine-validatable | ✅ | ❌ | ✅ | Partial |
| Success criteria built-in | ✅ | ❌ | ❌ | ❌ |
| Guardrails as first-class | ✅ | ❌ | ❌ | Partial |
| Fractal composition | ✅ | ❌ | Partial | ❌ |
| Zero dependencies (impl) | ✅ | N/A | ❌ | ❌ |
| Integrity verification | ✅ | ❌ | ❌ | ❌ |

---

## 6. Benefits

### For Developers

- **Reproducibility** — Same artifact, same behavior, any runtime
- **Debugging** — Success criteria make failures obvious
- **Portability** — No vendor lock-in

### For Organizations

- **Auditability** — Witness logs track every execution
- **Governance** — Guardrails enforce policy
- **Scalability** — Fractal composition handles complexity

### For the Ecosystem

- **Interoperability** — A2A-native, MCP-compatible
- **Open Standard** — MIT license, vendor-neutral
- **Future-Proof** — Runtime-agnostic design

---

## 7. CLI Tools

### 7.1 `@josfox/jos` — Reference Kernel

The stoic kernel for artifact execution. Zero dependencies.

```bash
npm install -g @josfox/jos

jos run artifact.jos              # Execute artifact
jos validate artifact.jos         # Validate schema + integrity
jos init my-task --pipeline       # Create new artifact
jos serve                         # Development dashboard
jos prompts optimize artifact.jos # Optimize prompts via API
```

### 7.2 `@josfox/jos-cli` — Extended CLI

Includes JOSFOX Internet captive portal support.

```bash
npm install -g @josfox/jos-cli

jos-cli enable-JOSFOX-internet    # Configure captive portal
```

### 7.3 `josctl` — Orchestration Controller

Standalone orchestration for pipelines and services.

```bash
npm install -g josctl

josctl run pipeline.jos           # Execute pipeline
josctl validate artifact.jos      # Validate artifact
josctl orchestration              # Interactive orchestration
```

### Package Matrix

| Package | npm | Purpose |
|---------|-----|---------|
| `@josfox/jos` | [![npm](https://img.shields.io/npm/v/@josfox/jos.svg)](https://www.npmjs.com/package/@josfox/jos) | Reference kernel |
| `@josfox/jos-cli` | [![npm](https://img.shields.io/npm/v/@josfox/jos-cli.svg)](https://www.npmjs.com/package/@josfox/jos-cli) | Extended CLI |
| `josctl` | [![npm](https://img.shields.io/npm/v/josctl.svg)](https://www.npmjs.com/package/josctl) | Orchestration controller |
| `josfox` | [![npm](https://img.shields.io/npm/v/josfox.svg)](https://www.npmjs.com/package/josfox) | Convenience alias |

---

## 8. When to Use .jos

### Ideal Use Cases

| Scenario | Why .jos Helps |
|----------|---------------|
| **Multi-agent workflows** | A2A-native payloads with success criteria |
| **CI/CD automation** | Reproducible, verifiable deployments |
| **LLM-powered tasks** | Guardrails prevent hallucination-driven failures |
| **Cross-organization handoffs** | Portable artifacts with integrity verification |
| **Audited environments** | Witness logging for compliance |

### Not Recommended For

- Simple one-off prompts (use direct LLM calls)
- Real-time streaming applications (use MCP)
- System administration scripts (use shell scripts)

---

## 9. Getting Started

### Quick Start

```bash
# Install
npm install -g @josfox/jos

# Create artifact
jos init deploy-app --pipeline

# Edit the generated .jos file
# Add your steps, success criteria, guardrails

# Validate
jos validate deploy-app.jos

# Execute (dry run first)
jos run deploy-app.jos --dry-run

# Execute for real
jos run deploy-app.jos
```

### Minimal Artifact

```json
{
  "jos": { "open": "jos run atom", "supports": ["@josfox/jos"] },
  "orchestration_contract": { "version": "0.0.7", "mode": "sync" },
  "meta": { "name": "example", "version": "1.0.0", "type": "atom" },
  "intention": {
    "objective": "Demonstrate .jos execution",
    "success_criteria": "Console outputs greeting"
  },
  "guardrails": { "avoid": [], "max_retries": 0 },
  "orchestration": {
    "definitions": {
      "greet": { "type": "shell", "command": "echo 'Hello from .jos!'" }
    },
    "flows": { "main": { "steps": ["greet"] } }
  },
  "security": { "type": "open", "permissions": [] },
  "files": [],
  "artifacts": { "description": "Minimal example" },
  "capabilities": ["demo"]
}
```

---

## 10. Roadmap

| Version | Target | Milestone |
|---------|--------|-----------|
| v0.1.0 | Q1 2026 | Beta release — stable schema |
| v0.2.0 | Q2 2026 | Full A2A Protocol integration |
| v0.3.0 | Q3 2026 | MCP guardrail policies |
| v1.0.0 | Q4 2026 | Production-ready specification |

---

## 11. Citation

If you use or implement the .jos standard in academic work:

```bibtex
@software{jos_open_standard,
  title = {.jos Open Standard},
  author = {JOS Open Standards Foundation},
  version = {format-v0.0.7_spec-v0.1.0-alpha},
  year = {2024},
  url = {https://github.com/josfox-ai/jos-format-spec}
}
```

See [CITATION.cff](./jos/CITATION.cff) for machine-readable citation.

---

## 12. License & Governance

### Open Standard

The `.jos` specification is **free and open source** under MIT License.

- ✅ Free to use, modify, distribute
- ✅ Commercial use permitted
- ✅ No royalties or patents
- ⚠️ Attribution required (cite JOS Open Standards Foundation)

### Governance

The standard is managed by the **JOS Open Standards Foundation**, a non-corporate entity dedicated to:

- Maintaining specification stability
- Ensuring vendor neutrality
- Enabling community contributions

See [GOVERNANCE.md](./jos/GOVERNANCE.md) for full governance model.

### The Standard vs. The Implementation

> ⚠️ **Important Distinction**

| Layer | Entity | License |
|-------|--------|---------|
| **Specification** | JOS Open Standards Foundation | MIT (open) |
| **Reference Implementation** | @josfox/jos (npm) | MIT (open) |
| **Commercial Platform** | JOSFOX Cloud | Proprietary |

You can build your own `.jos` runtime. The format is vendor-unlocked.

---

## Documentation

| Document | Description |
|----------|-------------|
| [SPECIFICATION.md](./jos/SPECIFICATION.md) | Full technical specification |
| [LLMs.md](./jos/LLMs.md) | LLM implementation guide with A2A/MCP examples |
| [LLM.md](./docs/LLM.md) | Quick LLM reference |
| [PROMPTS_API.md](./jos/PROMPTS_API.md) | Prompt optimization API specification |
| [NANO_AGENTS.md](./docs/concepts/NANO_AGENTS.md) | Nano Agent concept and comparison |
| [GOVERNANCE.md](./jos/GOVERNANCE.md) | Foundation governance model |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Contribution guide |
| [CHANGELOG.md](./CHANGELOG.md) | Version history |
| [CLI Documentation](./docs/cli/) | jos, josctl, jos-cli reference |

---

<div align="center">

**JOS Open Standards Foundation**

*Defining the portable standard for AI intention and execution*

---

*Format version v0.0.7 — Specification maturity v0.1.0 (Alpha)*

</div>
