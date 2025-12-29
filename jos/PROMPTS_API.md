# JOS Prompts API — Open Standard Specification

**Format version v0.0.7 — Specification maturity v0.1.0 (Alpha)**

*Managed by the JOS Open Standards Foundation*

---

## Overview

The **JOS Prompts API** defines an open standard for prompt optimization services. Any provider implementing this specification can be used via the `jos prompts` command to generate, validate, and optimize .jos-valid prompts for offline artifact creation.

---

## Design Goals

| Goal | Description |
|------|-------------|
| **Provider Neutral** | Any compliant service can implement the API |
| **Offline First** | Optimized artifacts run without network |
| **Quality Guaranteed** | Output meets .jos schema and quality standards |
| **Model Agnostic** | Works with any LLM (GPT-4, Claude, Llama, etc.) |

---

## CLI Command

### Synopsis

```bash
jos prompts <subcommand> [options]
```

### Subcommands

| Command | Description |
|---------|-------------|
| `optimize` | Improve prompts in existing .jos artifact |
| `validate` | Check prompt quality against standards |
| `upgrade` | Update prompts for newer model versions |
| `generate` | Create new .jos from natural language |
| `provider` | Manage API providers |

### Examples

```bash
# Optimize artifact prompts for GPT-4o
jos prompts optimize my-task.jos --model gpt-4o-2024

# Validate prompt quality
jos prompts validate deploy.jos

# Generate new artifact from intention
jos prompts generate "Deploy Next.js to Vercel" --output deploy.jos

# Use specific provider
jos prompts optimize task.jos --provider https://my-api.com/prompts

# Dry run (show changes without writing)
jos prompts optimize task.jos --dry-run
```

### Global Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `--model` | string | Provider default | Target LLM model |
| `--provider` | URL | JOSFOX Cloud | API endpoint |
| `--dry-run` | boolean | false | Preview changes |
| `--offline` | boolean | false | Use cached rules |
| `--output` | path | — | Output file path |

---

## API Specification

### Base URL

Default provider: `https://api.josfox.cloud/prompts`

Custom providers may implement the same contract at any URL.

---

### POST /optimize

Optimize prompts within a .jos artifact.

**Request**

```json
{
  "artifact": {
    "/* full .jos artifact */"
  },
  "options": {
    "target_model": "gpt-4o-2024",
    "optimization_goals": ["clarity", "specificity", "guardrail_compliance"],
    "preserve_structure": true
  },
  "format_version": "0.0.7"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `artifact` | object | ✅ | Complete .jos artifact |
| `options.target_model` | string | ❌ | LLM to optimize for |
| `options.optimization_goals` | string[] | ❌ | Optimization priorities |
| `options.preserve_structure` | boolean | ❌ | Keep orchestration intact |
| `format_version` | string | ✅ | .jos format version |

**Response**

```json
{
  "optimized_artifact": {
    "/* optimized .jos artifact */"
  },
  "changes": [
    {
      "field": "intention.objective",
      "original": "Deploy the app",
      "optimized": "Deploy Next.js application to Vercel production environment with zero-downtime rollout",
      "reason": "Added specificity: platform, environment, deployment strategy"
    }
  ],
  "quality_score": {
    "before": 0.72,
    "after": 0.94,
    "breakdown": {
      "clarity": 0.95,
      "specificity": 0.92,
      "measurability": 0.96
    }
  },
  "validation": {
    "schema_valid": true,
    "guardrails_present": true,
    "success_criteria_measurable": true
  }
}
```

---

### POST /validate

Validate prompt quality without modification.

**Request**

```json
{
  "artifact": { "/* .jos artifact */" },
  "format_version": "0.0.7"
}
```

**Response**

```json
{
  "valid": true,
  "quality_score": 0.87,
  "issues": [
    {
      "field": "intention.success_criteria",
      "severity": "warning",
      "message": "Success criteria could be more measurable"
    }
  ],
  "suggestions": [
    {
      "field": "guardrails.avoid",
      "suggestion": "Consider adding 'no-destructive-operations' guardrail"
    }
  ]
}
```

---

### POST /generate

Generate new .jos artifact from natural language.

**Request**

```json
{
  "intention": "Deploy my Next.js app to Vercel with preview on PRs",
  "options": {
    "type": "pipeline",
    "target_model": "gpt-4o-2024",
    "include_examples": true
  },
  "format_version": "0.0.7"
}
```

**Response**

```json
{
  "artifact": {
    "/* generated .jos artifact */"
  },
  "confidence": 0.91,
  "assumptions": [
    "Using Vercel CLI for deployment",
    "Project has package.json with build script"
  ]
}
```

---

## Quality Guarantees

All API responses MUST satisfy these invariants:

| Requirement | Description |
|-------------|-------------|
| **Schema Valid** | Output passes .jos JSON Schema validation |
| **Intention Preserved** | Semantic meaning of original unchanged |
| **Guardrails Intact** | All guardrails preserved or enhanced |
| **Success Criteria Measurable** | Criteria evaluable programmatically |
| **Offline Executable** | Artifact runs without network after optimization |
| **Idempotent** | Re-optimizing produces stable output |

---

## Provider Management

### Configuration

Providers stored in `~/.jos/prompts/providers.json`:

```json
{
  "providers": {
    "josfox-cloud": {
      "url": "https://api.josfox.cloud/prompts",
      "description": "Official JOSFOX Cloud provider"
    },
    "local-llm": {
      "url": "http://localhost:8080/prompts",
      "description": "Local Ollama instance"
    }
  },
  "default": "josfox-cloud"
}
```

### CLI Commands

```bash
# Add provider
jos prompts provider add <name> <url>

# Remove provider
jos prompts provider remove <name>

# List providers
jos prompts provider list

# Set default
jos prompts provider default <name>
```

---

## Authentication

Providers may require authentication via:

| Method | Header |
|--------|--------|
| API Key | `Authorization: Bearer <key>` |
| JWT | `Authorization: Bearer <jwt>` |

Credentials stored securely via `jos secrets`:

```bash
jos secrets set JOSFOX_API_KEY sk-xxx
```

---

## Error Responses

```json
{
  "error": {
    "code": "INVALID_ARTIFACT",
    "message": "Artifact missing required MAGIC kernel",
    "details": {
      "missing_fields": ["intention", "guardrails"]
    }
  }
}
```

| Code | HTTP | Description |
|------|------|-------------|
| `INVALID_ARTIFACT` | 400 | Malformed .jos artifact |
| `UNSUPPORTED_VERSION` | 400 | format_version not supported |
| `MODEL_UNAVAILABLE` | 503 | Requested model not available |
| `RATE_LIMITED` | 429 | Too many requests |

---

## Compliance

A provider is **JOS Prompts API Compliant** if it:

1. Implements all three endpoints (`/optimize`, `/validate`, `/generate`)
2. Satisfies all quality guarantees
3. Returns valid JSON matching response schemas
4. Handles all error codes appropriately

---

## License

This specification is part of the **.jos Open Standard** under MIT License.

---

*JOS Open Standards Foundation*
