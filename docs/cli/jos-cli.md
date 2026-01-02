# @josfox/jos-cli

## Extended CLI with JOSFOX Internet Support

**Version 1.0.8** | **Captive Portal Integration** | **Zero Dependencies**

[![npm](https://img.shields.io/npm/v/@josfox/jos-cli.svg)](https://www.npmjs.com/package/@josfox/jos-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

*Extended CLI for edge deployment and JOSFOX Internet captive portals*

---

## Overview

`@josfox/jos-cli` extends the core `@josfox/jos` kernel with specialized commands for **edge deployment** and **JOSFOX Internet captive portal** integration. It is designed for scenarios where .jos artifacts need to be executed on resource-constrained devices like Raspberry Pi or GL.iNet routers.

### Design Philosophy

| Principle | Implementation |
|-----------|----------------|
| **Edge Ready** | Optimized for Raspberry Pi and routers |
| **Captive Portal** | NodogSplash integration |
| **Zero Dependencies** | Pure Node.js (≥18) |
| **Billing Modes** | Free, paid, or hybrid access |

---

## Installation

```bash
# Global install
npm install -g @josfox/jos-cli

# Run without install
npx @josfox/jos-cli --help
```

---

## Commands

### All Core Commands

`@josfox/jos-cli` includes all commands from `@josfox/jos`:

- `jos-cli run` — Execute artifacts
- `jos-cli validate` — Validate schema
- `jos-cli init` — Create artifacts
- `jos-cli serve` — Development server
- `jos-cli prompts` — Prompt optimization
- `jos-cli secrets` — Credential management
- `jos-cli agent` — **NEW** Resilient daemon services (see [jos-agent.md](./jos-agent.md))

### `enable-JOSFOX-internet`

Configure JOSFOX Internet captive portal on GL.iNet routers.

```bash
jos-cli enable-JOSFOX-internet [options]

Options:
  --router <ip>       Router IP (default: 192.168.8.1)
  --mode <mode>       Billing mode: free | paid | hybrid
  --firebase          Enable Firebase authentication

Steps:
  1. Detects GL.iNet router
  2. Installs NodogSplash if needed
  3. Configures captive portal
  4. Sets up billing mode
  5. Deploys .jos artifact for portal management
```

**Billing Modes:**

| Mode | Description |
|------|-------------|
| `free` | Complementary access, no payment required |
| `paid` | Stripe integration, pay per session |
| `hybrid` | Free tier + paid premium |

---

## Bundled Artifacts

The package includes bundled `.jos` artifacts:

### `install-JOSFOX-internet.jos`

Located at: `artifacts/install-JOSFOX-internet.jos`

Automates the complete JOSFOX Internet setup:
- Router detection
- NodogSplash installation
- Portal configuration
- Firebase auth setup
- Billing integration

---

## Terminal Compatibility

Enhanced terminal support for edge devices:

| Feature | Support |
|---------|---------|
| Unicode/Emoji | Auto-detected, fallback to ASCII |
| 256 colors | Auto-detected, fallback to 16 colors |
| Raspberry Pi | Full ASCII/16-color support |
| SSH sessions | Graceful degradation |

---

## Version History

### v1.0.8 (Current) — 2025-12-28

**Added:**
- `enable-JOSFOX-internet` command
- Captive portal support for GL.iNet routers
- NodogSplash integration
- Firebase auth configuration wizard
- Billing modes: complementary, paid, hybrid
- Bundled `install-JOSFOX-internet.jos` artifact

### v1.0.7 — 2025-12-27

**Added:**
- Terminal capability detection
- ASCII fallback for limited terminals
- 16-color ANSI fallback

### v1.0.6 — 2025-12-27

**Added:**
- CLI improvements
- Better error messages

---

## JOSFOX Internet Architecture

```
┌────────────────────────────────────────────────────────────┐
│                    GL.iNet Router                          │
│  ┌──────────────────────────────────────────────────────┐ │
│  │                  NodogSplash                         │ │
│  │              (Captive Portal Engine)                 │ │
│  └─────────────────────────┬────────────────────────────┘ │
│                            │                              │
│  ┌─────────────────────────▼────────────────────────────┐ │
│  │              JOSFOX Internet Portal                  │ │
│  │  ┌────────────────┐  ┌────────────────────────────┐  │ │
│  │  │  Firebase Auth │  │  Stripe Billing            │  │ │
│  │  └────────────────┘  └────────────────────────────┘  │ │
│  └──────────────────────────────────────────────────────┘ │
│                            │                              │
│  ┌─────────────────────────▼────────────────────────────┐ │
│  │           @josfox/jos-cli Runtime                    │ │
│  │           (Manages portal via .jos)                  │ │
│  └──────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────┘
```

---

## Known Issues

| Issue | Status | Workaround |
|-------|--------|------------|
| Requires GL.iNet router | By design | Use core `@josfox/jos` for other devices |
| NodogSplash install requires SSH | Open | Pre-install via LuCI |
| Firebase auth requires network | By design | Use offline mode with local auth |

---

## Related Packages

| Package | Purpose |
|---------|---------|
| [@josfox/jos](./jos.md) | Reference kernel (all core commands) |
| [josctl](./josctl.md) | Orchestration controller |

---

## License

MIT License — JOS Open Standards Foundation

---

*Part of the [.jos Open Standard](./README.md)*
