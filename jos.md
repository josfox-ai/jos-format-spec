# @josfox/jos

## Stoic Kernel for AI Agent Orchestration

**Version 4.0.8** | **Format v0.0.7** | **Zero Dependencies**

[![npm](https://img.shields.io/npm/v/@josfox/jos.svg)](https://www.npmjs.com/package/@josfox/jos)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

*Reference implementation of the .jos Open Standard*

---

## Overview

`@josfox/jos` is the **reference kernel** for executing `.jos` artifacts. It provides the minimal, zero-dependency runtime required to validate, execute, and manage .jos files according to the open standard.

### Design Philosophy

| Principle | Implementation |
|-----------|----------------|
| **Stoic** | Minimal code, maximum reliability |
| **Zero Dependencies** | Pure Node.js (≥18), no npm packages |
| **Offline First** | Works without network, like Git |
| **Plugin Architecture** | Commands in `~/.jos/commands/` |

---

## Installation

```bash
# Global install
npm install -g @josfox/jos

# Run without install
npx @josfox/jos serve
```

---

## Commands

### `jos run`

Execute a .jos artifact.

```bash
jos run <artifact.jos> [options]

Options:
  --flow <name>     Flow to execute (default: main)
  --dry-run         Simulate without executing
  --insecure        Skip integrity verification
```

**Example:**
```bash
jos run deploy.jos --flow production --dry-run
```

### `jos validate`

Validate artifact schema and integrity.

```bash
jos validate <artifact.jos>

Checks:
  ✓ JSON syntax
  ✓ Required keys (MAGIC + JOSFOXAI kernels)
  ✓ SHA-256 integrity (if manifest present)
```

### `jos init`

Create a new artifact from template.

```bash
jos init <name> [--pipeline]

Options:
  --pipeline        Create pipeline template (multiple steps)
```

### `jos serve`

Start development dashboard.

```bash
jos serve [--port <number>]

Default port: 3000
```

### `jos prompts`

Prompt optimization via open API.

```bash
jos prompts optimize <artifact.jos> --model gpt-4o-2024
jos prompts validate <artifact.jos>
jos prompts generate "<intention>" --output <file.jos>
jos prompts provider add <name> <url>
```

### `jos secrets`

Manage encrypted credentials (AES-256).

```bash
jos secrets set <KEY> <value>
jos secrets get <KEY>
jos secrets list

Storage: ~/.jos/secrets/vault.json (encrypted)
```

### `jos add`

Add task definition to artifact.

```bash
jos add <task_name> <artifact.jos> --command "<shell command>"
```

### `jos get`

Fetch packages from repositories.

```bash
jos get <repo:package>

Example:
  jos get myrepo:deploy-tools
```

### `jos repo`

Manage package repositories.

```bash
jos repo add <name> <url>
jos repo list
jos repo remove <name>
```

---

## Architecture

```
~/.jos/
├── commands/       # Plugin commands
├── artifacts/      # Package cache
├── secrets/        # Encrypted vault (AES-256)
├── runs/           # Witness execution logs
├── prompts/        # Provider configuration
├── repos.json      # Repository configuration
└── lock.json       # Package integrity
```

---

## Version History

### v4.0.8 (Current) — 2025-12-28

**Added:**
- `jos prompts` command with optimize/validate/generate
- Terminal capability detection for Raspberry Pi
- ASCII art fallback for terminals without Unicode
- 16-color ANSI fallback for basic terminals

**Fixed:**
- `.jos` extension handling in run/validate

### v4.0.7 — 2025-12-27

**Added:**
- Enhanced step tracking in `jos run`
- Witness logging integration
- Improved dry-run output

### v4.0.4 — 2025-12-10

**Added:**
- Initial npm publish
- Core kernel (validate, run, init)
- Basic orchestration support

---

## Known Issues

| Issue | Status | Workaround |
|-------|--------|------------|
| Large artifacts (>10MB) may slow validation | Open | Split into smaller composed artifacts |
| Windows path handling | Open | Use forward slashes in artifact paths |

---

## Related Packages

| Package | Purpose |
|---------|---------|
| [josctl](./josctl.md) | Orchestration controller |
| [@josfox/jos-cli](./jos-cli.md) | Extended CLI with JOSFOX Internet |
| [josfox](https://www.npmjs.com/package/josfox) | Convenience alias |

---

## License

MIT License — JOS Open Standards Foundation

---

*Part of the [.jos Open Standard](./README.md)*
