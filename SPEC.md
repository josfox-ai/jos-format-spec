# .jos Specification (v0.9 RC)

## 1. Estructura
- `version`, `id`, `meta`, `compat`, `inputs`, `policy`, `signing`, `pipeline`, `artifacts`, `audit`.

## 2. Paso
- `role` (system|generator|critic|fixer|gate|tool|custom)
- `model`, `prompt`, `tool_call`, `inputs`, `outputs`, `when`, `config`

## 3. Políticas
- `token_budget` {prompt_max, total_max, hard_fail}
- `guards` {max_steps, max_runtime_s, retry{max,backoff}, retrieval_required}

## 4. Seguridad
- Secrets por referencia; OAuth2/SigV4/OCI; hash sha256 + firma opcional.

## 5. Protocolos
- MCP (tools), ACP (local agents), A2A (cards JSON-RPC).

## 6. Ejecución
- Contexto *last-writer-wins*.
- Reintentos y *dead_letter* al violar guardas.
