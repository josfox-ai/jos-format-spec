⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⡀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣾⠙⠻⢶⣄⡀⠀⠀⠀⢀⣤⠶⠛⠛⡇⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢹⣇⠀⠀⣙⣿⣦⣤⣴⣿⣁⠀⠀⣸⠇⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⣡⣾⣿⣿⣿⣿⣿⣿⣿⣷⣌⠋⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣴⣿⣷⣄⡈⢻⣿⡟⢁⣠⣾⣿⣦⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢹⣿⣿⣿⣿⠘⣿⠃⣿⣿⣿⣿⡏⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⠀⠈⠛⣰⠿⣆⠛⠁⠀⡀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣼⣿⣦⠀⠘⠛⠋⠀⣴⣿⠁⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣤⣶⣾⣿⣿⣿⣿⡇⠀⠀⠀⢸⣿⣏⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣠⣶⣿⣿⣿⣿⣿⣿⣿⣿⠿⠿⠀⠀⠀⠾⢿⣿⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⣠⣿⣿⣿⣿⣿⣿⡿⠟⠋⣁⣠⣤⣤⡶⠶⠶⣤⣄⠈⠀⠀⠀⠀⠀⠀
⠀⠀⠀⢰⣿⣿⣮⣉⣉⣉⣤⣴⣶⣿⣿⣋⡥⠄⠀⠀⠀⠀⠉⢻⣄⠀⠀⠀⠀⠀
⠀⠀⠀⠸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣟⣋⣁⣤⣀⣀⣤⣤⣤⣤⣄⣿⡄⠀⠀⠀⠀
⠀⠀⠀⠀⠙⠿⣿⣿⣿⣿⣿⣿⣿⡿⠿⠛⠋⠉⠁⠀⠀⠀⠀⠈⠛⠃⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠉⠉⠉⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀

.jos — Made with ❤️ & AI
.jos Open Standard (Alpha) — Managed by the JOS Open Standards Foundation
.jos is an open standard managed by the JOS Open Standards Foundation (JOS-Foundation).

It defines a single portable artifact — the .jos file — designed to move across tools, runtimes, and agent ecosystems without losing:

meaning (intent)

safety (guardrails/security)

execution logic (how it runs)

verifiability (success criteria + integrity)

Reference implementation & spec repo: josfox-ai/jos-format-spec. 
GitHub

What is a .jos file?
A .jos file is a:

file-based representation of automated, composable, transactional, abstract logic.

It is intentionally LLM/AI-friendly:

minimal required keys

explicit success criteria

explicit constraints/guardrails

portable orchestration model

machine-validatable schema

.jos is not “just a prompt” and not “just config”.

It is the minimum atomic unit that carries Intention + Execution together.

Why .jos exists (what it intends to resolve clearly)
1) Portable “intent that executes”
Most systems separate:

intention (docs, prompts, tickets)

execution (pipelines, scripts, vendor configs)

This breaks portability. .jos binds both into one artifact.

2) A universal “Definition of Done”
Agents and pipelines often fail because “done” is ambiguous.

.jos makes “done” explicit via:

intention.success_criteria

guardrails

machine validation + integrity hooks

3) Fractal composition (the universe law)
The same contract works for:

an atom

a pipeline

a service

a business

Because .jos composes recursively through files[] + orchestration.

4) Security is not optional
.jos elevates security and integrity to top-level requirements:

permissions model

health check expectations

integrity hash expectation

A2A relation (Agent2Agent Protocol)
A2A (Agent2Agent) is an open protocol created to enable interoperability between agents — i.e., how agents discover each other, communicate, and coordinate tasks across frameworks and vendors. 
Google Developers Blog
+2
A2A Protocol
+2

Google’s announcement frames A2A as a protocol designed for large-scale multi-agent collaboration and interoperability. 
Google Developers Blog

A2A resources:

A2A blog: a2aprotocol.ai/blog 
A2A Protocol
+1

Google Developers Blog announcement: “A2A: a new era of agent interoperability” 
Google Developers Blog

How they fit together
A2A = the wire protocol (agents talking to agents).

.jos = the portable executable intention artifact (what agents exchange, execute, validate, store, sell, and cite).

In other words:

A2A moves tasks/messages between agents.

.jos is the standard payload that can be transported, validated, and executed anywhere.

This makes .jos an excellent candidate for:

A2A Task payloads (send .jos, get run results/events back)

A2A AgentCard capability declarations (“this agent accepts .jos artifacts”)

Contract summary (LLM-friendly)
A valid .jos file MUST contain both:

MAGIC (Intention)
meta

artifacts

guardrails

intention

capabilities

JOSFOXAI (Execution)
jos

orchestration_contract

security

files

orchestration

x_run_params

adaptive_ai

id_jos

This produces the dual-kernel law:

MAGIC without JOSFOXAI → inert

JOSFOXAI without MAGIC → blind

Minimal valid example (v0.0.7)
json
Copy code
{
  "jos": {
    "open": "jos run atom",
    "supports": ["jos-cli"]
  },
  "orchestration_contract": {
    "version": "0.0.7",
    "mode": "sync"
  },
  "security": {
    "type": "open",
    "permissions": [],
    "health_check": "http://localhost/health",
    "integrity": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
  },
  "files": [],
  "orchestration": {
    "state": { "current_status": "idle" },
    "definitions": {},
    "flows": {}
  },
  "x_run_params": "",
  "adaptive_ai": {},
  "id_jos": {
    "uuid": "123e4567-e89b-12d3-a456-426614174000",
    "sku": "JOS-ATOM-001"
  },
  "meta": {
    "version": "1.0.0",
    "type": "atom",
    "name": "example",
    "provider": "local"
  },
  "artifacts": {
    "description": "Minimal example"
  },
  "guardrails": {
    "avoid": [],
    "max_retries": 0
  },
  "intention": {
    "objective": "Demonstrate a valid .jos file",
    "success_criteria": "Schema validation passes"
  },
  "capabilities": ["demo"]
}
Validator note: if your current schema enforces files.minItems = 1, either:

change schema to minItems: 0 (recommended), or

require a conventional reference (e.g., "./" or "./context.json")

Formal schema (JSON Schema 2020-12)
The canonical JSON Schema lives in the official repo (josfox-ai/jos-format-spec). 
GitHub

(Include your full schema JSON here as-is — unchanged.)

Alpha disclaimer (v0.0.1)
Status: ALPHA (v0.0.1).
This standard and any reference tooling are provided “AS IS”, without warranty.

No liability. No responsibility.

You may use .jos freely, including commercial use.

If you use or implement the .jos standard, you MUST cite and reference the JOS Open Standards Foundation and the official specification repository. 
GitHub

Governance & ecosystem positioning
The JOS Open Standards Foundation exists to keep .jos:

open

composable

implementation-agnostic

stable across ecosystems

We are aligned with the broader trend toward agent interoperability, including A2A and related efforts in the ecosystem. 
Google Developers Blog
+1

We welcome collaboration with infrastructure providers, agent frameworks, and platform ecosystems that are actively enabling interoperable multi-agent systems — including those investing in A2A adoption and tooling.

(Translation: we’re building something that fits the new rails.)

Suggested “How to cite” snippet
Add this to your README:

Cite the .jos Open Standard (JOS Open Standards Foundation)

Reference: josfox-ai/jos-format-spec 
GitHub

Version: v0.0.1-alpha
