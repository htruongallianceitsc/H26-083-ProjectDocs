# Workflow 18 — Brownfield Adoption & Reverse Engineering

```text
Existing repository/application
   ↓
source:adopt
   ↓
brownfield:inventory
   ↓
brownfield:candidates
   ↓
brownfield:review
   ↓
brownfield:promote
   ↓
brownfield:reconcile
   ↓
gate:baseline
   ↓
brownfield:baseline
   ↓
Optional brownfield:refactor-plan → reviewed WorkPlan
   ↓
Normal Ready → WorkPlan → implementation → Done
```

## Adopt in place first

Prefer adopting the existing root first. Do not force a physical migration to `apps/`, `packages/`, `tests/` or `infra/` before the system is understood.

## Candidate graph

Candidates are review objects backed by source evidence. They are not domain entities and live under `.project-docs/brownfield/`.

## Source normalization

`brownfield:refactor-plan` proposes target roots but does not mutate source. Convert the proposal into a reviewed WorkPlan before moving files or updating imports/build paths.
