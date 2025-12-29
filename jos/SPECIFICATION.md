<div align="center">

```
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
```

# .jos Open Standard

## Canonical Specification

**Format version v0.0.7 — Specification maturity v0.1.0 (Alpha)**

*Managed by the JOS Open Standards Foundation*

</div>

---

## 1. Canonical Description

**.jos** is an open standard that defines a portable, self-describing artifact format for encoding **intention** and **execution** as a single atomic unit. The format is intentionally LLM-friendly: explicit intent, explicit success criteria, explicit constraints, and machine-verifiable structure.

A `.jos` file is not a configuration file, not a prompt, and not a script. It is a **complete representation of automated logic** — containing what should happen (intention), why it should succeed (evaluation criteria), and how it should run (orchestration) — in one portable artifact that can be validated, composed, transported, and executed across any compliant runtime.

The standard introduces a **dual-kernel architecture**: every valid `.jos` artifact must contain both a **semantic kernel** (MAGIC) that defines meaning, success criteria, and constraints, and an **operational kernel** (JOSFOXAI) that defines execution pathways, security boundaries, and orchestration logic. Neither kernel is sufficient alone. MAGIC without JOSFOXAI is inert — it knows what to do but cannot act. JOSFOXAI without MAGIC is blind — it can act but does not know what success means. Together, they form the minimum viable unit of **intelligent automation**.

The `.jos` format is designed for fractal composition: the same artifact schema that describes a single atomic task also describes a multi-step pipeline, a long-running service, or an organization-wide workflow. This recursive self-similarity is not a design convenience — it is a core invariant that enables artifacts to compose, nest, and scale without schema translation or format conversion.

---

## 2. Elevator Definition

> **.jos** is an open standard for portable AI automation artifacts. Each `.jos` file encodes a complete unit of intention (what, why, success criteria) and execution (how, when, under what constraints) in a single, machine-validatable, fractally composable format — designed to move freely across agents, runtimes, and organizational boundaries without loss of meaning or executability.

---

## 3. Technical Proof of Coherence

The `.jos` standard achieves internal consistency through several interlocking design invariants:

### 3.1 Dual-Kernel Orthogonality

The MAGIC and JOSFOXAI kernels address fundamentally distinct concerns:

| Kernel | Domain | Responsibility |
|--------|--------|----------------|
| **MAGIC** | Semantic | `meta`, `intention`, `guardrails`, `artifacts`, `capabilities` |
| **JOSFOXAI** | Operational | `jos`, `orchestration_contract`, `security`, `files`, `orchestration` |

These domains do not overlap. Intention does not dictate execution mechanics. Execution does not define success criteria. This separation ensures that:

- Semantic changes (redefining success) do not require execution rewrites
- Execution changes (different runtime, different orchestrator) do not alter meaning
- Validation can be performed independently on each kernel

### 3.2 Completeness Constraint

A `.jos` artifact is valid if and only if **both kernels are present and internally valid**. This binary completeness constraint prevents partial artifacts from entering the ecosystem and ensures that any artifact, once validated, is both understandable and executable.

### 3.3 Schema Stability

The artifact schema is defined in JSON Schema (2020-12 dialect) with strict versioning via `orchestration_contract.version`. Schema evolution follows additive-only semantics: new optional fields may be introduced; existing required fields are immutable once published in a stable release.

### 3.4 Integrity Verification

Every `.jos` artifact carries an `integrity` field (SHA-256) enabling cryptographic verification of artifact contents. This allows secure transmission, caching, and deduplication without trusted intermediaries.

---

## 4. Justification of Fractal Composition

The "fractal universe" property is not a metaphor. It is a structural invariant with specific technical justification:

### 4.1 Recursive Schema Identity

The `.jos` schema makes no distinction between:

- An **atom** (a single executable task)
- A **pipeline** (a sequence of atoms)
- A **service** (a long-running pipeline with lifecycle hooks)
- An **organization** (a namespace containing services)

All four are valid `.jos` artifacts using the identical schema. The difference lies only in the contents of `orchestration.flows`, `files[]`, and nesting depth — not in the artifact format itself.

### 4.2 Composition via Reference

The `files[]` array enables one `.jos` artifact to reference others. When artifact A includes artifact B in its `files[]`, B's execution becomes a sub-step of A. This composition is:

- **Type-preserving**: B remains a valid `.jos` artifact independently
- **Context-aware**: B inherits execution context from A (secrets, runtime bindings)
- **Verifiable**: B's integrity hash is validated before inclusion

### 4.3 Scale Invariance

Because the schema is identical at all levels, tooling built for atoms automatically works for pipelines, services, and organizations. There is no "organization-level .jos" versus "task-level .jos" — there is only `.jos`.

---

## 5. Licensing & Governance Validation

The `.jos` Open Standard is governed under the following terms:

### 5.1 Open Standard

- The specification is published openly at [josfox-ai/jos-format-spec](https://github.com/josfox-ai/jos-format-spec)
- Anyone may read, implement, extend, or distribute the specification
- No registration, license fee, or approval is required to implement

### 5.2 Commercial Use

- Commercial use of the standard and compliant implementations is explicitly permitted
- There are no royalty obligations, patent encumbrances, or usage restrictions

### 5.3 Attribution Requirement

- Implementations and distributions of the `.jos` standard must cite the JOS Open Standards Foundation
- Attribution must reference the official specification repository
- This requirement ensures traceability and ecosystem coherence

### 5.4 Governance

- The standard is managed by the **JOS Open Standards Foundation**, a non-corporate entity
- Governance decisions prioritize openness, interoperability, and long-term stability
- The Foundation does not own or control any compliant runtime

### 5.5 Runtime Neutrality

- The standard is **runtime-agnostic**: any compliant executor may process `.jos` artifacts
- The standard is **vendor-neutral**: no single entity controls artifact execution
- Reference implementations exist, but they establish no privileged position

---

## 6. Why This Matters Now

The emergence of autonomous AI agents has created a coordination problem: agents must exchange tasks, validate outcomes, and compose workflows — but no standard exists for representing **what an agent should do** in a portable, verifiable, vendor-neutral format.

Current approaches suffer from fragmentation:

- **Prompts** carry intention but lack execution semantics
- **Pipelines** carry execution but lack portable success criteria
- **APIs** enable invocation but not introspection of intent

The `.jos` standard addresses this gap by providing a **first-class artifact format** that encodes both intention and execution in a single, composable unit.

Additionally, the emergence of protocols like A2A (Agent-to-Agent) creates a natural integration point: A2A defines how agents discover and communicate with each other; `.jos` defines **what those agents exchange**. The two are complementary:

- A2A is the **transport layer** (message passing, discovery, authentication)
- .jos is the **payload standard** (validated, executable, portable intention)

Organizations investing in agent infrastructure now face a choice: adopt fragmented, vendor-specific formats, or adopt an open standard designed for the multi-agent future. The `.jos` Open Standard offers the latter.

---

## Trademark & Legal Notices

- **JOS**, **JOSFOX**, and the Kitsune fox logo are trademarks of the JOS Open Standards Foundation
- **A2A Protocol** is property of its respective owners
- **Google** is a trademark of Google LLC
- This specification is an independent open-source project and is not affiliated with, endorsed by, or sponsored by any third-party trademark holders

This specification and associated materials are provided **"AS IS"**, without warranty of any kind. See [LICENSE](./LICENSE) for full terms.

---

<div align="center">

**JOS Open Standards Foundation**

*Defining the portable standard for AI intention and execution*

</div>
