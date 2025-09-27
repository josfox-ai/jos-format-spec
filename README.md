# @josfox/jos — v3.1 (Community Runtime)

**Spec-aligned**: tied to **JOSFOX `.jos` v0.3.1** (Experimental, Community Edition).  
Implements: **validate · run · serve · pack · publish · doc · test · lint** (community scope).

> **License**: MIT (code). The **spec** is **CC BY 4.0** — *attribution required*.  
> **No Warranty**: This software is provided **AS IS**. Users must implement their own safeguards.

**Repo (spec):** https://github.com/josfox-ai/jos-format-spec

## Install
```bash
npm i -g @josfox/jos
```

## Commands
- `jos validate <file>` — validate against v0.3.1 schema and resolve `$extends/$imports`.
- `jos run <file>` — execute a `task` or `pipeline` (shell/node; http/forge/ai are community stubs).
- `jos serve <file>` — run the declared `devServer` for local testing.
- `jos pack <file> --out dist.json` — package resolved artifact (JSON).
- `jos publish <file>` — placeholder for JOSFOX.cloud Forge.
- `jos doc <file> --out README.md` — generate quick docs from `.jos`.
- `jos test <file>` — run `checks[]` (basic assertions).
- `jos lint <path>` — basic spec lint.

## Eval hooks (fight evaluation blindness)
Declare in `.jos`:
```json
{
  "evaluation": {
    "contract": "stars_1_5",
    "feedbackEndpoint": "https://example.com/eval",
    "authToken": "REPLACE_ME",
    "context": {"project": "landing"}
  }
}
```
Then call:
```bash
jos run file.jos --eval.stars 5 --eval.notes "LGTM" --eval.context '{"actor":"human"}'
```

## Email privacy
- Use org-level maintainer (e.g., `oss@josfox.mx`) and hide personal email in npm profile.
- Use GitHub noreply for commits (Settings → Emails → “Keep my email addresses private”).

## License
- Code: **MIT**  
- Spec: **CC BY 4.0** (attribution required)  
- See `LICENSE`, `NOTICE`, and `THIRD_PARTY_NOTICES.md`.
