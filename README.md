# .jos — JOSFOX AI Prompt Format

> **Escribe una vez, corre en cualquier lado.** Un formato portátil de *prompt + pipeline* para entregar resultados reproducibles en minutos, no semanas.

[![CI — .jos runners](./.github/workflows/ci.yml)](.github/workflows/ci.yml)
[![Status: v0.9 RC](https://img.shields.io/badge/status-v0.9_RC-blue.svg)](#versionado)
[![License: CC BY 4.0](https://img.shields.io/badge/license-CC--BY--4.0-lightgrey.svg)](#licencia)

---

## ¿Qué es `.jos`?
Un **documento JSON/YAML** que define: metadata, entradas, política (tokens/seguridad), pasos de una **pipeline** (generar → criticar → arreglar → revisar), herramientas externas (APIs), artefactos y auditoría.  
**Portabilidad real:** el mismo `.jos` corre en **JOSFOX Forge**, `npx foxjos`, Python runner, **CrewAI**, **LangChain/LangGraph**, **LlamaIndex**, con modelos **OpenAI, Anthropic, Google, Ollama local**, y nubes **Azure, AWS Bedrock, Oracle OCI**.

### Beneficios
- **Repetible & auditable** (hash, presupuesto de tokens, límites de pasos/tiempo).
- **Menos alucinaciones** (ciclos generar→criticar→arreglar, citas y `retrieval_required`).
- **Multi‑cloud / multi‑framework** sin reescribir el flujo.
- **Human in the loop** (gates de revisión) y artefactos listos para publicar.

---

## Quickstart (2 minutos)

### Opción 1: Node CLI
```bash
npx foxjos run examples/landing-page.jos --inputs examples/inputs.yml
```

### Opción 2: Python runner
```bash
pip install -r runners/python/requirements.txt
python runners/python/run.py examples/landing-page.jos --fake
```

Artefactos se guardan en `./out/` con `audit.json`.

---

## Ejemplos incluidos
- `landing-page.jos` – Hero + bullets con loop de crítica/arreglo y gate humano.
- `rag-query.jos` – RAG con citas obligatorias vía herramienta MCP/Vector.
- `imagegen-pipeline.jos` – Brief → imagen → alt/caption.

---

## Protocolos & Interop (MCP / ACP / A2A)
`.jos` **no reemplaza** protocolos de runtime; **se acopla** a ellos:
- **MCP**: descubrimiento/uso de herramientas (HTTP+JSON).  
- **ACP**: coordinación local multi‑agente (IPC/ZeroMQ/gRPC).  
- **A2A**: colaboración entre agentes vía HTTPS/JSON‑RPC con *Agent Cards*.

Ver `docs/PROTOCOLS.md`.

---

## Portabilidad (adapters de referencia)

| Target | Soporte |
|---|---|
| **JOSFOX Forge** | Runner referencia (end‑to‑end) |
| **Node** (`npx foxjos`) | OpenAI, Ollama, Azure(FAKE o real), Bedrock(FAKE), Oracle(FAKE), Webhook tools (n8n/LogicApp/Lambda/Functions/ODA) |
| **Python** (`run.py`) | Igual que Node; Ollama local |
| **CrewAI** | `integrations/crewai_from_jos.py` (Fake LLM) |
| **LangChain/LangGraph** | `integrations/langgraph_from_jos.py` (Fake LLM) |
| **LlamaIndex** | (pendiente en RC, interfaz compatible) |

> **n8n**: cualquier workflow como herramienta webhook (`TOOL_<ID>=https://…`).

---

## Estructura de un `.jos` (resumen)
```yaml
version: "0.9"
id: "landing-gen-v1"
meta: { title: "Landing Generator", owner: "JOSFOX", license: "CC BY 4.0" }
compat: { models: ["auto-best","ollama:llama3:8b","azure:gpt-4o"], tools: ["n8n.create_lead"] }
inputs: { product_name: "JOSFOX Multi Pass", features: ["QR access","AI guidance"] }
policy:
  token_budget: { total_max: 80000, prompt_max: 6000, hard_fail: true }
  guards: { max_steps: 10, max_runtime_s: 90, retry: {max: 1, backoff: "exp"} }
pipeline:
  - role: system
    prompt: "Preciso, sin claims no verificables."
  - role: generator
    model: "auto-best"
    prompt: "Hero + 3 bullets para {{product_name}} con {{features}}."
    outputs: ["draft"]
  - role: critic
    prompt: "Enumera claims dudosos como issues[]."
    inputs: ["draft"]
    outputs: ["issues"]
  - role: fixer
    when: "{{issues.length > 0}}"
    prompt: "Revisa el draft corrigiendo issues."
    inputs: ["draft","issues"]
    outputs: ["final_copy"]
  - role: gate
    human_review: true
artifacts:
  save: [{ name: "landing.md", from: "final_copy" }]
audit: { capture: ["tokens","latency_ms","model_name","tool_calls"] }
```

---

## CI listo
- **GitHub Actions**: ejecuta Node runner, Python runner, y los mapeos CrewAI/LangGraph (fake) en cada PR.  
Mira `.github/workflows/ci.yml`.

---

## Contribuir
- Sigue **Keep a Changelog** + **SemVer**.
- PRs con ejemplos + tests (schema validation + golden outputs).
- Adapters nuevos: ver `foxjos/src/adapters/*` y `runners/python/adapters/*`.

---

## Versionado
- RC actual: **0.9.0-rc.1** (congelado salvo fixes).

## Licencia
- **Especificación**: CC BY 4.0  
- **Código de referencia**: Apache-2.0
