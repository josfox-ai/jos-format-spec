# jos-agent

## Resilient Daemon Services for .jos Artifacts

**Version 1.0.0** | **Multi-Platform** | **Remote Configuration**

[![npm](https://img.shields.io/npm/v/@josfox/jos-cli.svg)](https://www.npmjs.com/package/@josfox/jos-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

*Part of @josfox/jos-cli*

---

## Overview

`jos agent` enables installing `.jos` artifacts as **persistent daemon services** that:

- Run at system boot
- Connect to remote hub for configuration
- Apply configurations safely with rollback
- Report telemetry and status
- Survive reboots

---

## Commands

### `jos agent install`

Install a .jos artifact as a persistent daemon.

```bash
jos agent install <artifact.jos> [options]

Options:
  --hub <url>         Remote hub endpoint
  --name <service>    Service name (default: artifact name)
  --user <user>       Run as user (default: root)
  --env <key=value>   Environment variables (repeatable)
```

**Example:**
```bash
jos agent install my-service.jos --hub https://hub.example.com --name my-service
```

### `jos agent uninstall`

Remove an installed agent.

```bash
jos agent uninstall <name>
```

### `jos agent status`

Show status of an agent or all agents.

```bash
jos agent status [name]
```

### `jos agent logs`

View agent logs.

```bash
jos agent logs <name> [--follow]
```

### `jos agent list`

List all installed agents.

```bash
jos agent list
```

### `jos agent run`

Run agent in daemon mode (used internally by services).

```bash
jos agent run <artifact.jos> --hub <url>
```

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Remote Hub                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │ Registry    │  │ Config Store│  │ Telemetry Dashboard │ │
│  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘ │
└─────────┼────────────────┼────────────────────┼─────────────┘
          │     mTLS + Signed Configs          │
┌─────────▼────────────────▼────────────────────▼─────────────┐
│                     jos-agent (Device)                      │
│  1. Enroll → 2. Heartbeat → 3. Fetch → 4. Apply → 5. Report │
└─────────────────────────────────────────────────────────────┘
```

---

## Platform Support

| Platform | Init System | Status |
|----------|-------------|--------|
| Linux (Ubuntu, Debian) | systemd | ✅ Supported |
| OpenWrt (GL.iNet, etc.) | procd | ✅ Supported |
| Raspberry Pi | systemd | ✅ Supported |
| macOS | launchd | ✅ Supported |
| Windows | Windows Service | 🔜 Phase 3 |
| Android | WorkManager | 🔜 Phase 4 |
| iOS | Background Tasks | 🔜 Phase 4 |

---

## Security Model

| Control | Purpose |
|---------|---------|
| **mTLS** | Mutual TLS between agent and hub |
| **Signed configs** | Only hub admin can issue configs |
| **Schema validation** | No arbitrary commands from cloud |
| **Rollback** | Auto-revert on apply failure |
| **Least privilege** | Run as non-root where possible |

---

## Agent Runtime Loop

```
1. Load local config
2. Wait for network connectivity
3. Enroll with hub (if first run)
4. Heartbeat (report status)
5. Fetch desired-state config
6. Verify signature
7. Apply safely (with rollback)
8. Report result
9. Sleep / backoff
→ (repeat from 4)
```

---

## Files

| Path | Purpose |
|------|---------|
| `~/.jos/agents/` | Agent configurations |
| `~/.jos/logs/` | Log files (launchd) |
| `/etc/systemd/system/` | systemd service files |
| `/etc/init.d/` | procd service files |
| `~/Library/LaunchAgents/` | launchd plist files |

---

## Desired-State Schema

```json
{
  "jos": { "open": "jos agent run", "supports": ["@josfox/jos-cli"] },
  "kind": "jos.agent.desired_state",
  "meta": {
    "name": "my-service",
    "version": 42
  },
  "spec": {
    "apply": [
      { "type": "shell", "command": "..." },
      { "type": "file", "path": "...", "content": "..." },
      { "type": "service", "name": "...", "action": "restart" }
    ],
    "health_check": {
      "type": "http",
      "url": "http://localhost:8080/health"
    },
    "telemetry": {
      "interval": 60
    }
  },
  "signature": {
    "alg": "ed25519",
    "key_id": "hub-root",
    "sig": "base64..."
  }
}
```

---

## Use Cases

| Scenario | Description |
|----------|-------------|
| **Edge devices** | IoT gateways, routers, sensors |
| **Captive portals** | WiFi access points, hotspots |
| **Print servers** | Managed print services |
| **AI services** | Model inference endpoints |
| **Custom appliances** | White-label hardware products |

---

## Related

- [jos-cli.md](./jos-cli.md) — Extended CLI documentation
- [jos.md](./jos.md) — Reference kernel
- [josctl.md](./josctl.md) — Orchestration controller

---

## License

MIT License — JOS Open Standards Foundation

---

*Part of the [.jos Open Standard](../README.md)*
