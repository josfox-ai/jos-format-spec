# josctl

## Orchestration Controller for .jos Pipelines

**Version 0.0.5** | **Standalone Operation** | **Zero Dependencies**

[![npm](https://img.shields.io/npm/v/josctl.svg)](https://www.npmjs.com/package/josctl)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

*Pipeline and service orchestration for the .jos ecosystem*

---

## Overview

`josctl` is the **orchestration controller** for `.jos` pipelines and services. While `@josfox/jos` executes individual artifacts, `josctl` manages their **lifecycle** — coordinating multi-artifact workflows, validating integrity chains, and providing interactive orchestration interfaces.

### Design Philosophy

| Principle | Implementation |
|-----------|----------------|
| **Standalone** | Works with or without `@josfox/jos` installed |
| **Smart Detection** | Finds JOS binary (global, npx, dependency) |
| **Zero Dependencies** | Pure Node.js (≥18) |
| **Pipeline Native** | Designed for multi-artifact orchestration |

---

## Installation

```bash
# Global install
npm install -g josctl

# Run without install
npx josctl --help
```

---

## Commands

### `josctl run`

Execute a .jos artifact with orchestration support.

```bash
josctl run <artifact.jos> [options]

Options:
  --flow <name>     Flow to execute (default: main)
  --dry-run         Simulate without executing
```

**Features:**
- Auto-appends `.jos` extension if missing
- Smart binary detection

**Example:**
```bash
josctl run orchestration --flow publish_all
# Equivalent to: josctl run orchestration.jos --flow publish_all
```

### `josctl validate`

Validate artifact with integrity verification.

```bash
josctl validate <artifact.jos>

Checks:
  ✓ JSON syntax
  ✓ MAGIC kernel present
  ✓ JOSFOXAI kernel present
  ✓ Integrity manifest (if referenced)
```

### `josctl orchestration`

Interactive orchestration mode for complex pipelines.

```bash
josctl orchestration [--direct]

Modes:
  Interactive     Select artifacts and flows via prompts
  Direct          Execute default orchestration immediately
```

### `josctl status`

Show JOS ecosystem status.

```bash
josctl status

Output:
  ✓ jos kernel: /path/to/jos
  ✓ artifacts: 5 found
  ✓ witness logs: 92 runs
```

---

## Binary Detection

`josctl` automatically locates the JOS kernel:

```
1. Global install: $(which jos)
2. npx: npx @josfox/jos
3. Local dependency: ./node_modules/.bin/jos
4. Bundled: Fallback to josctl's own execution
```

---

## Version History

### v0.0.5 (Current) — 2025-12-28

**Added:**
- Standalone operation without `@josfox/jos` dependency
- Smart JOS binary detection (global, npx, dependency)
- Auto-append `.jos` extension when missing

**Fixed:**
- Extension handling in `run` and `validate` commands

### v0.0.4 — 2025-12-27

**Added:**
- Initial public release
- Orchestration controller for .jos pipelines
- Interactive orchestration mode

---

## Proposed Roadmap (v1.0)

See [josctl-proposal.md](./josctl-proposal.md) for full roadmap.

### v1.0 (MVP)
- [ ] `josctl start <artifact>` — Start as daemon
- [ ] `josctl stop <name|pid>` — Stop service
- [ ] `josctl status` — List running services
- [ ] `josctl logs <name>` — Stream logs

### v1.1 (Scheduling)
- [ ] `josctl schedule` — Cron-based scheduling
- [ ] `josctl trigger` — Event-based triggers
- [ ] `josctl health` — Health checks

### v1.2 (Scaling)
- [ ] `josctl scale` — Horizontal scaling
- [ ] `josctl deploy` — Environment deployment
- [ ] `josctl rollback` — Version rollback

---

## Architecture Relationship

```
┌─────────────────────────────────────────────────────────────┐
│                         josctl                              │
│                 (Orchestration Controller)                  │
│       start | stop | status | scale | schedule              │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ manages
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                          jos                                │
│                    (Stoic Kernel)                           │
│              serve | run | get | secrets                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ executes
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     .jos Artifacts                          │
│         atom.jos  |  pipeline.jos  |  service.jos          │
└─────────────────────────────────────────────────────────────┘
```

---

## Known Issues

| Issue | Status | Workaround |
|-------|--------|------------|
| No Windows service support | Open | Use pm2 or similar |
| Interactive mode requires TTY | Open | Use `--direct` flag |

---

## Related Packages

| Package | Purpose |
|---------|---------|
| [@josfox/jos](./jos.md) | Reference kernel |
| [@josfox/jos-cli](./jos-cli.md) | Extended CLI |

---

## License

MIT License — JOS Open Standards Foundation

---

*Part of the [.jos Open Standard](./README.md)*
