# JOSFOX .jos Format — Specification v0.1-dev

**Status:** Development / Experimental  
**License:** CC BY 4.0 (spec), Apache 2.0 (implementations)

This document defines the *experimental* v0.1 of the `.jos` format:
a declarative JSON artifact that standardizes **prompts**, **connections** and **endpoints** for AI pipelines.

## 1. Document shape

Top-level keys:

- `schema` (string URL) — versioned schema identifier
- `id` (string) — unique artifact id (reverse-DNS or vendor prefix recommended)
- `name` (string)
- `version` (semver-like string)
- `meta` (object) — owner, license, languages, status
- `prompt` (object) — template, variables, constraints
- `connection` (object) — provider, model, auth
- `endpoint` (object) — endpoint contracts
- `routing` (object, optional) — targets / fallbacks
- `dist` (object, optional) — cache/signing info

## 2. Prompt contract

- `language` — language the prompt is written in (output can differ).
- `max_user_chars` — hard limit applied to user-controlled text fields.
- `template` — string with `{{variables}}` placeholders.
- `variables` — typed dictionary describing allowed inputs. Supported types in v0.1: `string`, `enum`, `boolean`.
- `constraints` (optional) — e.g., `forbidden_words`, `max_tokens_hint`.
- `computed` (optional) — small lookup maps the runtime may expand (e.g., channel rules).

## 3. Connection & Endpoint

- `connection` defines *how* to call a provider (model, auth mode, timeouts).
- `endpoint` declares REST-ish routes used by the runtime (method, path, body/response hints).

## 4. Distribution & Signing (optional in v0.1)

- `dist.cacheable` — runtime may cache by artifact hash.
- `dist.signature` — detached signature metadata (Ed25519/JWS suggested).

## 5. Validation

Artifacts SHOULD validate against `schemas/jos.schema.v0.1.json`.  
A reference validator is provided under `tools/jos-validate.mjs` (Node + Ajv).

## 6. Compatibility notes (v0.1-dev)

- This is an *experimental* shape: fields may change.
- Non‑breaking additions are expected; breaking changes will bump `schema` URL.
