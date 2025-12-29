# JOS Governance

**Version 1.0 — December 2024**

---

## 1. The JOS Open Standards Foundation

The **.jos Open Standard** is managed by the **JOS Open Standards Foundation** (the "Foundation"), a non-corporate entity dedicated to the stewardship of open standards for AI agent orchestration.

The Foundation exists to ensure that the .jos standard remains:

- **Open** — Freely available to read, implement, and extend
- **Stable** — Predictable evolution with clear versioning semantics
- **Vendor-neutral** — Unaffiliated with any single runtime, platform, or vendor
- **Community-driven** — Responsive to ecosystem needs and contributions

---

## 2. Scope of Governance

The Foundation governs:

| Domain | Scope |
|--------|-------|
| **Format Specification** | The .jos artifact schema and semantics |
| **Versioning Authority** | Format version (v0.0.7) and Specification maturity (v0.1.0) |
| **Canonical Repository** | [josfox-ai/jos-format-spec](https://github.com/josfox-ai/jos-format-spec) |
| **Trademark Stewardship** | JOS, JOSFOX, Kitsune logo |

The Foundation does **not** govern:

- Any specific runtime implementation
- Commercial products built on the standard
- Derivative specifications created by third parties

---

## 3. Neutrality Principles

### 3.1 Runtime Neutrality

The .jos standard is **runtime-agnostic**. Any compliant executor may process .jos artifacts. Reference implementations (such as `@josfox/jos`) are provided for convenience and validation; they do not establish privileged position.

### 3.2 Vendor Neutrality

No vendor, organization, or individual may claim exclusive rights over .jos artifacts or their execution. The standard is designed for ecosystem-wide adoption.

### 3.3 Protocol Alignment

The .jos standard is designed to complement (not compete with) transport-layer protocols such as A2A (Agent-to-Agent). The relationship is:

- **A2A** = transport layer (agent discovery, communication)
- **.jos** = payload standard (portable executable intention)

---

## 4. Versioning Model

The .jos ecosystem uses a **two-axis versioning model**:

| Axis | Purpose | Current |
|------|---------|---------|
| **Format Version** | .jos artifact schema | v0.0.7 |
| **Specification Maturity** | Document completeness | v0.1.0-alpha |

### 4.1 Format Version Semantics

- **Major**: Breaking schema changes
- **Minor**: Additive schema changes
- **Patch**: Documentation clarifications

### 4.2 Specification Maturity Stages

| Stage | Meaning |
|-------|---------|
| Alpha | Exploratory; breaking changes expected |
| Beta | Stabilizing; breaking changes rare |
| RC | Release candidate; final review |
| Stable | Frozen; additive-only changes |

---

## 5. Contribution Model

### 5.1 Proposals

Changes to the .jos standard are accepted via:

1. **GitHub Issues** — For discussion and feedback
2. **Pull Requests** — For proposed specification changes
3. **RFC Documents** — For significant architectural changes

### 5.2 Review Process

All changes are reviewed for:

- Internal consistency with dual-kernel model (MAGIC + JOSFOXAI)
- Backward compatibility with existing artifacts
- Clarity and precision of language

### 5.3 Acceptance Criteria

Changes are accepted when they:

- Improve clarity, consistency, or capability
- Do not introduce vendor dependencies
- Maintain fractal composition properties

---

## 6. Licensing

The .jos specification is released under terms that:

- **Permit** commercial use without royalty
- **Require** attribution to the JOS Open Standards Foundation
- **Provide** no warranty ("AS IS")

See [LICENSE](./LICENSE) for full terms.

---

## 7. Attribution Requirement

Implementations of the .jos standard must include visible attribution to:

- The **JOS Open Standards Foundation**
- The official specification repository: [josfox-ai/jos-format-spec](https://github.com/josfox-ai/jos-format-spec)

This requirement ensures traceability and ecosystem coherence.

---

## 8. Contact

- **Repository**: https://github.com/josfox-ai/jos-format-spec
- **Website**: https://josfox.ai

---

<div align="center">

**JOS Open Standards Foundation**

*Defining the portable standard for AI intention and execution*

</div>
