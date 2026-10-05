# Progressive Specification Standard — v5.3

## Purpose

Documentation depth is a first-class project decision. Use the lightest specification level that is safe for the current delivery maturity, while preserving stable entity identity and an explicit path to deeper documentation later.

## Levels

- `lightweight` — mock, POC, prototype, discovery, simple internal tools and other low-risk work where detailed entity decomposition would be wasteful.
- `standard` — normal product delivery; explicit Requirement and Test traceability is expected before implementation.
- `full` — production-critical, sensitive, regulated, destructive or high-impact work; stronger failure/security/NFR documentation is required.
- `auto` — asks tooling/AI to recommend an effective level from maturity and configured risk signals. `auto` is a selection mode, not a persisted effective level.

## Two independent dimensions

Specification depth and lifecycle are separate:

```text
spec_level: lightweight | standard | full | auto
status: draft | planned | in_progress | implemented | deprecated
```

An approved/planned Lightweight spec can be complete for a prototype. Lightweight never means "unfinished" by itself.

## Resolution order

For a Feature:

1. `feature.spec_level` when present.
2. `project.profile.json.documentation.defaultSpecLevel`.
3. `registry/spec-profiles.json.defaultLevel`.

If the requested level is `auto`, the effective level comes from maturity + risk recommendation.

## Target maturity

Supported maturity values:

- `concept`
- `prototype`
- `uat`
- `production`

Feature-level `target_maturity` overrides the project default. Maturity influences the minimum recommendation but does not rewrite the chosen level silently.

## Lightweight minimum viable documentation

A Lightweight Feature must still communicate:

- Goal / purpose.
- Actor / user.
- Main flow.
- Key rules.
- Acceptance summary.
- Known technical impact when known.
- Open questions / assumptions when relevant.

It does **not** require separate Requirement or Test Case entities by default.

## Progressive normalization

Do not create separate "lightweight entities". Keep stable Feature code and progressively extract inline knowledge when promotion requires it:

```text
FEAT-X lightweight
  inline acceptance / route / API notes
        ↓ promote to standard
FEAT-X same identity
  REQ-X-001
  TC-X-001
  SCR-X / API-X when applicable
        ↓ promote to full
FEAT-X same identity
  NFR / security / failure / audit depth
```

## Risk escalation

`registry/spec-profiles.json` defines maturity minimums and risk rules. A selected level below recommendation is visible as a warning by default. Projects may set:

```json
{
  "documentation": {
    "riskEscalation": "warn"
  }
}
```

Allowed values are `warn`, `block`, and `off`. Never weaken a rule only to make a gate pass.

## Promotion

Use `spec:promote` to generate a target-level gap report. Promotion does not invent missing product behaviour.

```bash
npm run spec:promote -- --feature FEAT-X --to standard
```

Only apply the new level after gaps are resolved:

```bash
npm run spec:promote -- --feature FEAT-X --to standard --apply
```

## Governance rule

Ready/Done gates are mode-aware. Lightweight may pass with its minimal Feature contract; Standard/Full must satisfy the stronger profile configured in `registry/spec-profiles.json`.
