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

# @josfox/jos-cli

**Minimal Stoic Kernel for AI Agent Orchestration**

[![npm](https://img.shields.io/badge/npm-@josfox/jos--cli-00ffff?style=for-the-badge)](https://www.npmjs.com/package/@josfox/jos-cli)
[![Version](https://img.shields.io/badge/version-1.0.3-success?style=for-the-badge)](#)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-purple?style=for-the-badge)](LICENSE)

*77 Lines • Zero Dependencies • Pure Node.js*

</div>

---

## Overview

**@josfox/jos-cli** is the minimal kernel-only distribution of the JOS runtime. It contains the stoic 77-line kernel that routes commands to plugins — nothing more.

> For the full developer edition with commands, use [@josfox/jos](https://www.npmjs.com/package/@josfox/jos).

---

## Install

```bash
npm install -g @josfox/jos-cli
jos --help
```

---

## What's Included

- `bin/jos` — The 77-line stoic kernel
- Command routing to `~/.jos/commands/`
- Aurora design system with Kitsune branding

---

## The .jos Standard

This kernel implements the **.jos Open Standard** — a portable artifact format encoding both **intention** (MAGIC) and **execution** (JOSFOXAI) in a single file.

**Dual-Kernel Law:**
- MAGIC without JOSFOXAI → inert
- JOSFOXAI without MAGIC → blind

> Full specification: [github.com/josfox-ai/jos-format-spec](https://github.com/josfox-ai/jos-format-spec)

---

## A2A Compatibility

- **A2A** = transport layer (agent-to-agent communication)
- **.jos** = payload standard (portable executable intention)

---

## Disclaimer

This software is provided **"AS IS"**, without warranty. You use it **at your own risk**.

**Trademarks:** JOS, JOSFOX, and the Kitsune logo are trademarks of the JOS Open Standards Foundation.

---

## License

**MIT** — Free for personal and commercial use. Attribution required.

---

<div align="center">

**Made with ❤️ & AI**

*JOS Open Standards Foundation*

</div>
