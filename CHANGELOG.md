# Changelog

All notable changes to the `.jos` specification and packages.

## [Unreleased]

### Added
- **`jos prompts` command** — Prompt optimization via open API
  - `optimize` — Improve prompts in existing .jos artifacts
  - `validate` — Check prompt quality against standards
  - `generate` — Create new .jos from natural language intention
  - `provider` — Manage API providers
- **PROMPTS_API.md** — Open standard specification for prompt optimization services
- **LLMs.md** — LLM implementation guide with A2A and MCP integration examples
- LLM.md for AI agent-friendly specification reference
- JOSFOX Internet captive portal support in jos-cli
- Raspberry Pi terminal compatibility (ASCII/16-color fallback)
- Standalone josctl operation (no jos dependency required)

---

## [0.0.7] - 2025-12-28

### @josfox/jos v4.0.8
- Added terminal capability detection for Raspberry Pi
- ASCII art fallback for terminals without Unicode fonts
- 16-color ANSI fallback for basic terminals
- Fixed `josctl run` and `josctl validate` .jos extension handling

### @josfox/jos-cli v1.0.8
- Added `enable-JOSFOX-internet` command
- Captive portal support for GL.iNet routers
- NodogSplash integration
- Firebase auth configuration wizard
- Billing modes: complementary, paid, hybrid
- Bundled install-JOSFOX-internet.jos artifact

### josctl v0.0.5
- Standalone operation without jos dependency
- Smart JOS binary detection (global, npx, dependency)
- Auto-append .jos extension when missing

---

## [0.0.6] - 2025-12-27

### @josfox/jos v4.0.7
- Enhanced `jos run` with detailed step tracking
- Witness logging integration
- Improved dry-run output

### @josfox/jos-cli v1.0.6
- CLI improvements

### josctl v0.0.4
- Initial public release
- Orchestration controller for .jos pipelines

---

## [0.0.5] - 2025-12-26

### Added
- Detached integrity manifests (SHA-256)
- `jos add` command for CLI-driven artifact manipulation
- `jos validate` with JOSFOXAI/MAGIC key verification
- Witness logging in `~/.jos/runs/`

---

## [0.0.4] - 2025-12-10

### Added
- Initial npm publish
- Core kernel (validate, run, init)
- Basic orchestration support

---

## Version Scheme

The `.jos` format uses a two-axis versioning model:

```
Format Version: X.Y.Z (the file format itself)
Specification Maturity: X.Y.Z-stage (how ready for production)
```

Current: `Format v0.0.7 — Spec Maturity v0.1.0 (Alpha)`

---

## Roadmap

- [ ] v0.1.0 — Beta release with stable schema
- [ ] v0.2.0 — A2A Protocol integration
- [ ] v0.3.0 — MCP guardrail policies
- [ ] v1.0.0 — Production-ready specification
