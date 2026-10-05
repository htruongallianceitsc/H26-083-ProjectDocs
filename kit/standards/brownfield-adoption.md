# Brownfield Adoption Standard

## Purpose

Bring an existing codebase into the docs-first workspace without pretending that documentation existed before the implementation.

## Core rule

Brownfield evidence is initially **derived**. It becomes canonical only after explicit review and promotion.

```text
Existing Source
  -> Application adoption
  -> Inventory
  -> Candidate graph
  -> Human/AI review
  -> Promote canonical docs
  -> Reconcile
  -> Brownfield Baseline Gate
  -> Baseline
  -> Normal docs-first lifecycle
```

## Safety rules

1. `source:adopt` registers an existing application boundary; it does not restructure source.
2. `brownfield:inventory` and `brownfield:candidates` create derived runtime evidence only.
3. Candidate generation must never auto-promote canonical entities.
4. `brownfield:promote` requires an accepted review unless policy explicitly changes.
5. Source normalization must be planned first. `brownfield:refactor-plan` never moves files.
6. A reviewed WorkPlan is required before physical normalization/refactoring.
7. Create the initial brownfield baseline only after `gate:baseline` passes.
8. After baseline completion, normal Ready/Done governance applies to future changes.

## Reconciliation findings

- `UNREVIEWED_CANDIDATE`
- `ACCEPTED_NOT_PROMOTED`
- `MISSING_EVIDENCE`
- `LOW_CONFIDENCE_MAPPING`
- `UNCLASSIFIED_SOURCE`
- `PROMOTED_ENTITY_MISSING`

High-severity findings block the baseline gate according to `kit/registry/brownfield.json`.
