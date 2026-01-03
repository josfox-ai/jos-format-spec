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

**Agent and Service Management for JOS**

[![npm](https://img.shields.io/badge/npm-@josfox/jos--cli-00ffff?style=for-the-badge)](https://www.npmjs.com/package/@josfox/jos-cli)
[![Version](https://img.shields.io/badge/version-1.0.8-success?style=for-the-badge)](#)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-purple?style=for-the-badge)](LICENSE)

*Zero Dependencies • Pure Node.js*

</div>

---

## Overview

**@josfox/jos-cli** provides daemon agent management and cloud-provisionable services for the JOS ecosystem. Install persistent `.jos`-driven agents on edge devices like Raspberry Pi, OpenWrt routers, and Linux servers.

> For the full developer toolkit (serve, run, validate, secrets), use [@josfox/jos](https://www.npmjs.com/package/@josfox/jos).

---

## Install

```bash
npm install -g @josfox/jos-cli
jos-cli --help
```

---

## Commands

### `jos-cli agent`

Install and manage `.jos` daemon agents.

```bash
# Install an agent as a persistent service
jos-cli agent install my-service.jos --hub https://hub.example.com

# View agent status
jos-cli agent status my-service

# List all installed agents
jos-cli agent list

# View logs
jos-cli agent logs my-service

# Uninstall
jos-cli agent uninstall my-service
```

**Subcommands:** `install`, `uninstall`, `status`, `logs`, `list`, `run`

---

### `jos-cli enable-service`

Enable cloud-provisionable services on the current device.

```bash
# Interactive service setup
jos-cli enable-service --service captive-portal

# Fetch config from JOS Cloud
jos-cli enable-service --from-cloud --agent-id abc123

# Load from local .jos file
jos-cli enable-service --from-file my-print-service.jos

# List available services
jos-cli enable-service --list
```

**Available Services:**

| Service | Description | Platforms |
|---------|-------------|-----------|
| `captive-portal` | WiFi captive portal with auth | OpenWrt, Linux, Raspberry Pi |
| `shared-print` | Cloud print queue | Linux, Raspberry Pi, Windows, macOS |
| `kiosk-display` | Digital signage | Linux, Raspberry Pi, Windows |
| `file-share` | Local network file sharing | All platforms |
| `sensor-hub` | IoT sensor data collection | Raspberry Pi, Linux |

---

## Testing

```bash
npm test
```

---

## The .jos Standard

This CLI implements the **.jos Open Standard** — a portable artifact format encoding both **intention** (MAGIC) and **execution** (JOSFOXAI) in a single file.

> Full specification: [github.com/josfox-ai/jos-format-spec](https://github.com/josfox-ai/jos-format-spec)

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
