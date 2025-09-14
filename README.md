# .jos Format — v0.1-dev

**EN (below) · ES (abajo)**

---

## 📘 English

The **`.jos` format** is a declarative JSON artifact for prompts, endpoints and connections.  
Version **0.1-dev** is experimental — intended for iteration and community feedback.

### Goals
- **Consistency**: e-commerce photography templates (white background, channel rules)
- **Portability**: decouple prompts from providers
- **Security**: limit user input with `max_user_chars`, forbidden words
- **Caching/Signing**: stable, reproducible artifacts

### Quick start
- Validate: `node tools/jos-validate.mjs examples/apparel.ecom.jos`
- Integrate: client sends only **variables**; server resolves template → final prompt; call `/api/generate/apparel`.

### Files
- `schemas/jos.schema.v0.1.json` — JSON Schema
- `examples/apparel.ecom.jos` — canonical example
- `tools/jos-validate.mjs` — Node validator (Ajv)
- `licenses/` — CC BY 4.0 (spec), Apache 2.0 (implementations)

---

## 📘 Español

El **formato `.jos`** es un artefacto JSON declarativo para prompts, endpoints y conexiones.  
La versión **0.1-dev** es experimental — pensada para iterar con la comunidad.

### Objetivos
- **Consistencia**: plantillas de foto e‑commerce (fondo blanco, reglas por canal)
- **Portabilidad**: desacoplar prompts de proveedores
- **Seguridad**: limitar entrada del usuario con `max_user_chars`, palabras prohibidas
- **Caché/Firma**: artefactos estables y reproducibles

### Inicio rápido
- Validar: `node tools/jos-validate.mjs examples/apparel.ecom.jos`
- Integrar: el cliente envía solo **variables**; el servidor resuelve la plantilla → prompt final; invoca `/api/generate/apparel`.
