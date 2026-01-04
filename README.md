# .jos Format Specification

A portable JSON format for encoding automation intentions.

## What It Is

- An **open file format** specification
- A **JSON structure** for portable automation artifacts
- A **versioned standard** with semantic versioning

## What It Is NOT

- Not a runtime or executor
- Not a product or SDK
- Not a programming language

## Quick Example

```json
{
  "id_jos": "hello-world-v1",
  "orchestration_contract": {
    "version": "0.0.7"
  },
  "intention": {
    "objective": "Greet the user",
    "success_criteria": "User receives greeting"
  }
}
```

## Specification

📄 **[SPEC.md](SPEC.md)** — Full format specification

📐 **[schemas/](schemas/)** — JSON Schema definitions

📁 **[examples/](examples/)** — Conformant artifact examples

## Current Version

**v0.0.7** (Draft)

## License

MIT License with attribution encouraged.

When referencing this specification, please cite:

> JOS Format Specification, v0.0.7  
> https://github.com/josfox-ai/jos-format-spec

---

© 2026 JOS Open Standards Foundation
