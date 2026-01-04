# Changelog

All notable changes to the .jos specification.

## [0.0.7] - 2026-01-04

### Changed
- Restructured as standards-only repository
- Removed implementation code (moved to separate packages)
- Added JSON Schema definitions
- Added conformance examples

### Added
- `SPEC.md` — Formal specification document
- `schemas/` — JSON Schema for validation
- `examples/` — Conformant artifact examples

## [0.0.6] - 2025-12

### Added
- `guardrails` block for execution constraints
- `security` block for access control

## [0.0.1] - 2025-11

### Added
- Initial draft specification
- Core fields: `id_jos`, `orchestration_contract`, `intention`

---

## Breaking Change Policy

- MAJOR version: Breaking changes to required fields
- MINOR version: New optional fields, non-breaking
- PATCH version: Documentation, clarifications
