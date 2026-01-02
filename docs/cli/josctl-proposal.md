# josctl — JOS Orchestration Controller

**Proposed Capabilities for josctl v1.0**

---

## Overview

**josctl** is the orchestration controller for .jos services and pipelines. While `jos` (the kernel) executes artifacts, `josctl` manages their **lifecycle** — starting, stopping, monitoring, and coordinating long-running .jos services.

| Tool | Purpose |
|------|---------|
| `jos` | Execute .jos artifacts (run, serve, get) |
| `josctl` | Orchestrate .jos services (start, stop, status, scale) |

---

## Proposed Commands

### Service Lifecycle

```bash
josctl start <artifact.jos>      # Start as background service
josctl stop <name|pid>           # Stop a running service
josctl restart <name|pid>        # Restart a service
josctl status [name]             # Show status of services
```

### Pipeline Orchestration

```bash
josctl run <pipeline.jos>        # Run pipeline to completion
josctl schedule <artifact.jos> --cron "0 * * * *"  # Schedule execution
josctl trigger <pipeline.jos> --on webhook         # Event-triggered
```

### Service Management

```bash
josctl list                      # List all managed services
josctl logs <name|pid>           # View service logs
josctl inspect <name>            # Show service details
josctl health <name>             # Check health endpoint
```

### Scaling & Clustering

```bash
josctl scale <name> --replicas 3       # Scale horizontally
josctl deploy <artifact.jos> --env prod  # Environment deployment
josctl rollback <name>                 # Rollback to previous version
```

### Configuration

```bash
josctl config set <key> <value>  # Set configuration
josctl config get <key>          # Get configuration  
josctl env set <key> <value>     # Set environment variable
josctl secrets link <vault>      # Link to secrets vault
```

---

## Architecture Relationship

```
┌─────────────────────────────────────────────────────┐
│                    josctl                           │
│         (Orchestration Controller)                  │
│  ┌─────────────────────────────────────────────┐   │
│  │  start | stop | status | scale | schedule   │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
                         │
                         │ manages
                         ▼
┌─────────────────────────────────────────────────────┐
│                     jos                             │
│              (Stoic Kernel)                         │
│  ┌─────────────────────────────────────────────┐   │
│  │  serve | run | get | secrets | repo         │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
                         │
                         │ executes
                         ▼
┌─────────────────────────────────────────────────────┐
│               .jos Artifacts                        │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │
│  │  atom.jos   │ │ pipeline.jos│ │ service.jos │   │
│  └─────────────┘ └─────────────┘ └─────────────┘   │
└─────────────────────────────────────────────────────┘
```

---

## Comparison with Existing Tools

| Feature | josctl | systemd | docker-compose | pm2 |
|---------|--------|---------|----------------|-----|
| .jos native | ✅ | ❌ | ❌ | ❌ |
| MAGIC validation | ✅ | ❌ | ❌ | ❌ |
| Fractal composition | ✅ | ❌ | Partial | ❌ |
| Zero dependencies | ✅ | ✅ | ❌ | ❌ |
| Secrets integration | ✅ | ❌ | Partial | ❌ |
| A2A compatible | ✅ | ❌ | ❌ | ❌ |

---

## Implementation Priority

### v1.0 (MVP)

- [ ] `josctl start <artifact>` — Start as daemon
- [ ] `josctl stop <name|pid>` — Stop service
- [ ] `josctl status` — List running services
- [ ] `josctl logs <name>` — Stream logs
- [ ] `josctl run <pipeline>` — Run pipeline

### v1.1 (Scheduling)

- [ ] `josctl schedule` — Cron-based scheduling
- [ ] `josctl trigger` — Event-based triggers
- [ ] `josctl health` — Health checks

### v1.2 (Scaling)

- [ ] `josctl scale` — Horizontal scaling
- [ ] `josctl deploy` — Environment deployment
- [ ] `josctl rollback` — Version rollback

---

## Zero Dependency Design

Like `jos`, `josctl` should be built with zero external dependencies:

```
josctl
├── Pure Node.js (>=18)
├── Uses: child_process, fs, path, http
├── Manages: PID files, log rotation
└── Integrates: ~/.jos/services/
```

---

## Service State Directory

```
~/.jos/
├── services/           # josctl managed
│   ├── registry.json   # Service registry
│   ├── <name>/
│   │   ├── pid         # Process ID
│   │   ├── logs/       # Rotated logs
│   │   ├── config.json # Runtime config
│   │   └── artifact.jos → symlink to source
└── ...
```

---

## Next Steps

1. Refactor existing josctl (remove chalk, commander, etc.)
2. Align with zero-dependency architecture
3. Implement lifecycle commands (start/stop/status)
4. Add pipeline orchestration
5. Publish josctl v1.0.0

---

*josctl — Orchestrate the fractal universe.*
