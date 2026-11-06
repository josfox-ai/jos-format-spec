# .jos format draft 0.0.7 — historical record

> **This is not the current specification.** The current, normative text is [`.jos` 2.0.0 in josfox-jos/jos-spec](https://github.com/josfox-jos/jos-spec). Use this repository only to understand or migrate documents written for the 0.0.7 draft.

## Why it is kept

`0.0.7` was the first public shape of `.jos`: a portable JSON file that captured an automation intention (`id_jos`, `orchestration_contract`, `intention.objective`, `intention.success_criteria`). Real documents were written against it. Keeping the draft online means those documents can still be read, explained and moved forward, and it shows how the format grew from a file convention into a media type under IANA review (ticket #1460136).

## What changed since 0.0.7

| Topic | 0.0.7 (this draft) | 2.0.0 (current) |
|---|---|---|
| Header | `orchestration_contract.version` | `jos.version` and `jos.kind` |
| Success | one free-text `success_criteria` | a list of machine-checkable criteria |
| Limits | not defined | `guardrails`: what to avoid and hard limits |
| Media type | none | `application/vnd.jos+json` |
| Conformance | example tests | a test kit run by two independent kernels |

## Reading 0.0.7 documents today

The `jos` command line still reads this draft:

```bash
npm install -g @josfox/jos
jos validate my-old-file.jos
```

The 2.0.0 specification defines how a 2.0.0 reader normalizes 0.0.7 documents whose flow steps are strings; 0.0.7 documents with object-form steps are rejected with exit code 2, and their normalization is scheduled for 2.1 (see `IANA.md` in the specification).

## Contents

`SPEC.md` (the draft), `schemas/`, `examples/`, `tests/`, `CHANGELOG.md`, `LICENSE` (MIT).

## The rest of the family

**The open standard**
- [The current .jos specification (2.0.0)](https://github.com/josfox-jos/jos-spec) — the successor of this draft; start your migration there.
- [The .jos community start page](https://github.com/josfox-jos/jos) — install, try and contribute.
- [The jos.mx landing page source](https://github.com/josfox-jos/jos.mx) — the one-page introduction to the standard.
- [A2A.jos, the protocol fork for agent-to-agent `.jos`](https://github.com/josfox-ai/A2A.jos) — where the format travels between agents.
- [.jos-a2a-js, the JavaScript SDK fork](https://github.com/josfox-ai/.jos-a2a-js) — the matching client library work.

**Built by JOSFOX**
- [JOSFOX AI deep-link helper](https://github.com/josfox-ai/josfoxai-deep-link) — opens the JOSFOX AI app, with a web fallback.
- [The reserved josfox-jos deep-link name](https://github.com/josfox-jos/josfoxai-deep-link) — a pointer, no code.

## Public platform documentation — expanded ecosystem

For readers of `josfox-ai/jos-format-spec`, distribution status per platform is documented in one public hub; its existence does not imply a downloadable artifact or verified host compatibility.

- For readers of `josfox-ai/jos-format-spec`, [jos-omni](https://github.com/josfox-ai/jos-omni) provides distribution documentation hub.
