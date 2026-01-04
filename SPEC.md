# .jos Format Specification

> **Version:** 0.0.7 (Draft)  
> **Status:** Proposed Standard

## Overview

The `.jos` format is a JSON-based file format for encoding automation intentions. It provides a portable, versionable structure for describing **what** should be accomplished and **how** to verify completion.

## File Format

- **Extension:** `.jos`
- **Encoding:** UTF-8
- **MIME Type:** `application/vnd.jos+json`

## Minimal Valid Artifact

```json
{
  "id_jos": "example-v1",
  "orchestration_contract": {
    "version": "0.0.7"
  }
}
```

## Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `id_jos` | string | Unique artifact identifier |
| `orchestration_contract.version` | string | Spec version (semver) |

## Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `meta` | object | Name, version, author, license |
| `intention` | object | Objective, context, success criteria |
| `guardrails` | object | Constraints, limits, boundaries |
| `security` | object | Permissions, access control |

## Intention Block

```json
{
  "intention": {
    "objective": "What to accomplish",
    "context": "Background information",
    "success_criteria": "Definition of done"
  }
}
```

## Guardrails Block

```json
{
  "guardrails": {
    "max_retries": 3,
    "timeout_ms": 30000,
    "avoid": ["sensitive_operations"]
  }
}
```

## Schema

See `/schemas/jos-artifact.schema.json` for the complete JSON Schema.

## Examples

See `/examples/` for conformant artifact examples.

## Versioning

This specification follows semantic versioning. Breaking changes increment the MAJOR version.

## License

MIT License — See [LICENSE](LICENSE)

---

© 2026 JOS Open Standards Foundation
