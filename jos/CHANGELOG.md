# Changelog

All notable changes to the .jos Open Standard and reference implementations are documented here.

This project uses a **two-axis versioning model**:
- **Format Version**: .jos artifact schema (currently v0.0.7)
- **Specification Maturity**: Document completeness (currently v0.1.0-alpha)

---

## [Unreleased]

### Added
- GOVERNANCE.md — Foundation stewardship model
- CITATION.cff — Academic citation format (Zenodo-ready)
- Two-axis versioning documentation

---

## [@josfox/jos v4.0.4] - 2024-12-26

### Added
- Lock file support (`~/.jos/lock.json`) with SHA-256 integrity
- `--detach` flag for background shadow clone processes
- Mermaid.js flow diagrams in `/studio` dashboard
- Multi-location command discovery (npm package + user overrides)

### Changed
- Kernel display version updated to v4.0
- Dashboard footer version synchronized
- Command routing searches both `~/.jos/commands/` and bundled `src/commands/`

### Security
- AES-256-CBC encryption for secrets vault
- Path traversal protection in serve module
- Integrity verification on all artifact operations

---

## [@josfox/jos v4.0.0] - 2024-12-26

### Added
- Complete rewrite with zero dependencies
- 77-line stoic kernel architecture
- `serve` command with full dashboard
- `run` command with MAGIC contract validation
- `get` command with multi-source package fetching
- `secrets` command with AES-256 encryption
- `repo` command for repository management
- Aurora design system with Kitsune branding

### Removed
- All external dependencies (ajv, yargs)

---

## [Format v0.0.7] - 2024-12-26

### Specification
- Dual-kernel architecture formalized (MAGIC + JOSFOXAI)
- Fractal composition model documented
- A2A Protocol alignment defined
- LLM-friendly design principles added

---

## [Format v0.0.1] - 2024-09

### Initial
- Initial .jos format specification draft
- Basic schema definition
- Proof of concept implementations

---

[Unreleased]: https://github.com/josfox-ai/jos-format-spec/compare/v4.0.4...HEAD
[@josfox/jos v4.0.4]: https://github.com/josfox-ai/jos-format-spec/releases/tag/v4.0.4
[@josfox/jos v4.0.0]: https://github.com/josfox-ai/jos-format-spec/releases/tag/v4.0.0
[Format v0.0.7]: https://github.com/josfox-ai/jos-format-spec/releases/tag/spec-0.0.7
[Format v0.0.1]: https://github.com/josfox-ai/jos-format-spec/releases/tag/spec-0.0.1
