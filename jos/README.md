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

# @josfox/jos

**Format version v0.0.7 — Specification maturity v0.1.0 (Alpha)**

**Stoic Kernel for AI Agent Orchestration**

[![npm](https://img.shields.io/badge/npm-@josfox/jos-00ffff?style=for-the-badge)](https://www.npmjs.com/package/@josfox/jos)
[![Version](https://img.shields.io/badge/version-4.0.8-success?style=for-the-badge)](#)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#zero-dependencies)
[![License](https://img.shields.io/badge/license-MIT-purple?style=for-the-badge)](LICENSE)

*Zero Dependencies • Offline First • Open Standard*

</div>

---

## Overview

**@josfox/jos** is the reference implementation of the **.jos Open Standard** — a portable artifact format for AI agent orchestration.

| Feature | Description |
|---------|-------------|
| **Stoic Kernel** | 77-line minimal kernel with zero dependencies |
| **Plugin Architecture** | Commands live in `~/.jos/commands/` or bundled |
| **Offline First** | Works without network, like Git |
| **A2A Compatible** | Designed for Agent-to-Agent interoperability |

---

## Quick Start

```bash
# Run with npx (no install required)
npx josfox serve

# Or install globally
npm install -g @josfox/jos
jos serve
```

---

## Commands

| Command | Description |
|---------|-------------|
| `jos serve` | Start development server with dashboard |
| `jos run <file>` | Execute .jos artifacts |
| `jos get <package>` | Fetch packages from repositories |
| `jos secrets` | Manage encrypted credentials (AES-256) |
| `jos repo` | Manage package repositories |

```bash
# Examples
jos serve --port 8080
jos run artifact.jos --dry-run
jos get myrepo:package-name
jos secrets set API_KEY sk-abc123
```

---

## The .jos Standard

A `.jos` file binds **Intention** and **Execution** into one portable artifact:

```json
{
  "meta": { "name": "example", "version": "1.0.0" },
  "intention": {
    "objective": "What this artifact does",
    "success_criteria": "How to know it worked"
  },
  "guardrails": { "avoid": [], "max_retries": 3 },
  "orchestration": {
    "flows": { "main": { "steps": ["task1", "task2"] } }
  }
}
```

> Full specification: [jos.md](./jos.md)

---

## Architecture

```
~/.jos/
├── commands/       # Plugin architecture
├── artifacts/      # Package cache
├── secrets/        # Encrypted vault (AES-256)
├── runs/           # Execution epochs
├── repos.json      # Repository configuration
└── lock.json       # Package integrity
```

---

## A2A Protocol Compatibility

This implementation is designed to be compatible with agent interoperability protocols, including the A2A (Agent-to-Agent) Protocol.

- **.jos artifacts** can serve as A2A task payloads
- **Agents** can declare .jos compatibility in capability cards
- **Integrity verification** ensures secure artifact exchange

---

## Disclaimer & Legal

### AS-IS Software

This software is provided **"AS IS"**, without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose, and noninfringement.

### Liability

In no event shall the authors, contributors, or the JOS Open Standards Foundation be liable for any claim, damages, or other liability, whether in an action of contract, tort, or otherwise, arising from, out of, or in connection with the software or the use or other dealings in the software.

### Your Responsibility

- You use this software **at your own risk**
- You are responsible for validating its suitability for your use case
- You are responsible for compliance with applicable laws and regulations

### Trademark Notice

- **JOS**, **JOSFOX**, and the Kitsune fox logo are trademarks of the JOS Open Standards Foundation
- **A2A Protocol** and related terminology are property of their respective owners
- **Google** and related trademarks are property of Google LLC
- All other trademarks are property of their respective owners

This project is an independent open-source implementation and is **not affiliated with, endorsed by, or sponsored by** any third-party trademark holders mentioned in this documentation.

### Citation Requirement

If you implement or distribute the .jos standard, you must include attribution to:
- The **JOS Open Standards Foundation**
- The official specification repository

---

## License

**MIT License** — See [LICENSE](./LICENSE) for details.

Free to use for personal, educational, and commercial purposes.

---

<div align="center">

**Made with ❤️ & AI**

*JOS Open Standards Foundation*

```
██╗  ██╗██╗████████╗███████╗██╗   ██╗███╗   ██╗███████╗
██║ ██╔╝██║╚══██╔══╝██╔════╝██║   ██║████╗  ██║██╔════╝
█████╔╝ ██║   ██║   ███████╗██║   ██║██╔██╗ ██║█████╗  
██╔═██╗ ██║   ██║   ╚════██║██║   ██║██║╚██╗██║██╔══╝  
██║  ██╗██║   ██║   ███████║╚██████╔╝██║ ╚████║███████╗
╚═╝  ╚═╝╚═╝   ╚═╝   ╚══════╝ ╚═════╝ ╚═╝  ╚═══╝╚══════╝
```

</div>
