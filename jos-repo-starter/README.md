<div align="center">

# 🦊 JOS Repo Starter

**Practical examples to make the most of your JOS experience**

[![JOS v0.0.7](https://img.shields.io/badge/JOS-v0.0.7-purple)](https://github.com/josfox-ai/jos-format-spec)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

</div>

---

## 🌌 The Fractal Universe

> *"Everything is a prompt. Every prompt is an intention. Every intention is an artifact."*

**JOS (JSON Orchestration Spec)** is not just a file format—it's a philosophical approach to AI-human collaboration. Born from the recognition that modern AI systems need **structured intentions** rather than free-form prompts, JOS defines the **minimum viable atomic unit for automation**.

### The Core Insight

Traditional prompts are ephemeral. They disappear after use. They can't be versioned, shared, or composed. JOS changes this by treating every automation request as a **first-class citizen**:

```
.jos file = Intention + Orchestration + Guardrails
```

This creates a **fractal architecture** where:
- Every `.jos` artifact can contain other artifacts
- Every agent can spawn sub-agents
- Every intention can decompose into smaller intentions
- ...infinitely, like a fractal

---

## 🏗️ The JOS Ecosystem

```
┌─────────────────────────────────────────────────────────────┐
│                    JOS OPEN STANDARDS                        │
│                   (Specification Layer)                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐    │
│   │   JOS   │   │   FOX   │   │ JOSCTL  │   │ FOXCTL  │    │
│   │ Kernel  │   │ Runtime │   │   CLI   │   │   CLI   │    │
│   └────┬────┘   └────┬────┘   └────┬────┘   └────┬────┘    │
│        │             │             │             │          │
│        └─────────────┴─────────────┴─────────────┘          │
│                           │                                  │
│                    ┌──────┴──────┐                          │
│                    │   ALAIA     │                          │
│                    │ Nano-Agent  │                          │
│                    │  Framework  │                          │
│                    └─────────────┘                          │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                     ADAPTERS                                 │
│   ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐          │
│   │ Ollama  │ │ Gemini  │ │ OpenAI  │ │Anthropic│          │
│   └─────────┘ └─────────┘ └─────────┘ └─────────┘          │
├─────────────────────────────────────────────────────────────┤
│                   INTEROPERABILITY                           │
│              Google A2A Protocol Support                     │
└─────────────────────────────────────────────────────────────┘
```

### Key Components

| Component | Purpose |
|-----------|---------|
| **JOS Kernel** | Core runtime that parses and executes `.jos` artifacts |
| **FOX Runtime** | Production-grade executor with SHA integrity checks |
| **ALAIA** | Adaptive Learning AI Agent - the nano-agent framework |
| **JOSCTL/FOXCTL** | CLI tools for managing artifacts and agents |
| **Adapters** | Bridges to LLM providers (local & cloud) |

---

## 🎯 Intention-Native Architecture

JOS introduces **Intention-Native** thinking:

1. **Define the WHAT, not the HOW** - Describe your goal, let the system figure out execution
2. **Guardrails over Instructions** - Constrain behavior rather than prescribe it
3. **Composable by Default** - Every artifact can be part of a larger flow

### The Nano-Service Pattern

Traditional microservices are too heavy. JOS introduces **nano-services**:

```json
{
  "intention": {
    "objective": "Resize all images in /uploads to max 1200px width",
    "success_criteria": "All images processed, originals preserved"
  },
  "guardrails": {
    "max_retries": 3,
    "timeout_ms": 30000,
    "avoid": ["delete_originals", "lossy_compression_below_80"]
  }
}
```

A nano-service:
- Has a **single, clear intention**
- Is **guard-railed** for safety
- Runs in **isolation**
- Can be **composed** with others

---

## 🤖 ALAIA: The Nano-Agent Bond

**ALAIA** (Adaptive Learning AI Agent) is the framework that brings `.jos` artifacts to life:

```
                    ┌──────────────┐
                    │   ALAIA      │
                    │  Nano-Agent  │
                    └──────┬───────┘
                           │
            ┌──────────────┼──────────────┐
            ▼              ▼              ▼
      ┌──────────┐   ┌──────────┐   ┌──────────┐
      │ task.jos │   │ flow.jos │   │ api.jos  │
      └──────────┘   └──────────┘   └──────────┘
```

ALAIA agents:
- **Bond** to `.jos` artifacts (like a soul to a body)
- **Adapt** based on execution feedback
- **Learn** from guardrail violations
- **Communicate** via Google A2A protocol

---

## 🌐 Interoperability: Google A2A

JOS is designed with **Google's Agent-to-Agent (A2A) protocol** as a first-class citizen:

- **Agent Cards** describe capabilities
- **Tasks** are exchanged as JSON
- **Artifacts** flow between agents
- **Streaming** for real-time collaboration

This means JOS agents can talk to ANY A2A-compliant system, not just other JOS agents.

---

## 🎨 KRMEN Design System

The visual layer of JOS is powered by **[KRMEN](https://krmen.mx)** - a fractal design system:

| Layer | Purpose |
|-------|---------|
| L0 | Foundations (8px grid, typography) |
| L1 | Canvas (backgrounds, gradients) |
| L2 | Decorations (glass, neon, shadows) |
| L3 | UI Components (cards, buttons) |
| L4 | Intelligence (MAGIC Kernel) |
| L5 | Effects (particles, bloom) |

KRMEN ensures **100/100 Lighthouse scores** with automated optimization.

---

## 🚀 Quick Start: Local LLM with Ollama

### 1. Install JOS CLI

```bash
npm install -g @josfox/jos
```

### 2. Get the Ollama adapter

```bash
jos get ollama
```

### 3. Run the setup

```bash
jos run ollama.jos
```

This will:
- ✅ Detect your platform
- ✅ Check for GPU (warns if CPU-only)
- ✅ Register Ollama as a provider
- ✅ Pull a lightweight model
- ✅ Test the connection

### 4. Execute your first intention

```bash
jos llm examples/reference-v0.0.7.jos --provider local
```

---

## 📦 What's in this Repo?

```
jos-repo-starter/
├── registry.json           # Package index for `jos get`
├── adapters/
│   ├── ollama.jos          # Local LLM setup
│   └── gemini-cli.jos      # Google Gemini integration
└── examples/
    └── reference-v0.0.7.jos # Canonical spec example
```

---

## 🏛️ JOS Open Standards Foundation

JOS is governed by open standards:

- **Specification**: [jos-format-spec](https://github.com/josfox-ai/jos-format-spec)
- **Reference Implementation**: [@josfox/jos](https://www.npmjs.com/package/@josfox/jos)
- **Design System**: [KRMEN](https://krmen.mx)
- **Community**: Coming soon

---

## 🔮 The Vision

We believe the future of AI is:

1. **Intention-Native** - Systems that understand goals, not just commands
2. **Fractal** - Infinitely composable, self-similar architectures
3. **Interoperable** - Agents that speak a common language (A2A)
4. **Adaptive** - Systems that learn from every execution
5. **Human-Centric** - AI as a collaborator, not a black box

JOS is our contribution to that future.

---

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](../LICENSE) file for details.

### Disclaimer

JOS is provided "AS IS" without warranty. See the full disclaimer in the LICENSE file.

---

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guide](../CONTRIBUTING.md) before submitting PRs.

---

<div align="center">

**Made with 🦊 by [JOSFOX AI](https://github.com/josfox-ai)**

**Founded by Josué Gómez**

*"Every prompt is a seed. Every artifact is a tree. The forest is the future."*

</div>
