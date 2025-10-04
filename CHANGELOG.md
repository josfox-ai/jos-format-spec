# Changelog

Este proyecto sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y [SemVer](https://semver.org/spec/v2.0.0.html).

## [0.9.0-rc.1] - 2025-10-04
### Añadido
- README completo con Protocolos & Interop y guía de portabilidad.
- Schema `schemas/jos.schema.json`.
- Ejemplos: `landing-page.jos`, `rag-query.jos`, `imagegen-pipeline.jos`.
- Runners: `foxjos` (Node CLI) y `runners/python`.
- Integraciones: CrewAI y LangGraph (fake LLM).
- CI: Node, Python, CrewAI, LangGraph en GitHub Actions.

### Cambiado
- SPEC.md: alineado a v0.9 RC (sección de ejecución, guardrails).

### Pendiente
- Adapters reales para AWS Bedrock y Oracle OCI.
