# v5.7 Upgrade Notes — Brownfield Adoption & Reverse Engineering

## Goal

Add a governed path for existing software projects to enter the docs-first workspace without rewriting everything from zero or falsely treating source-derived guesses as canonical business truth.

## New lifecycle

```text
Existing Source
  -> source:adopt
  -> brownfield:inventory
  -> brownfield:candidates
  -> review
  -> promote
  -> reconcile
  -> Brownfield Baseline Gate
  -> initial baseline
  -> normal docs-first lifecycle
```

## New tooling

- `brownfield:inventory`
- `brownfield:candidates`
- `brownfield:review`
- `brownfield:promote`
- `brownfield:reconcile`
- `brownfield:status`
- `brownfield:refactor-plan`
- `gate:baseline`
- `brownfield:baseline`

## New policy and assets

- `kit/registry/brownfield.json`
- `kit/standards/brownfield-adoption.md`
- `kit/workflows/18-brownfield-adoption.md`
- `kit/prompts/44-brownfield-reverse-engineering.md`
- `kit/templates/brownfield/*`

## Runtime evidence

Brownfield runtime lives under `.project-docs/brownfield/`. Inventory, reconciliation and refactor-plan output are rebuildable evidence. Candidate review/promotion state is governance runtime but does not replace canonical Markdown entities.

## Safety decisions

1. `candidatePolicy.autoPromote = false` by default.
2. Accepted review is required before promotion.
3. Technology adapters classify evidence; they do not establish business truth.
4. `brownfield:refactor-plan` never moves files.
5. `normalization.allowDirectMove = false` by default.
6. Physical normalization should be executed through a reviewed WorkPlan after the initial brownfield baseline.

## Adoption state

`project.profile.json.adoption` now records `mode`, `strategy` and `baselineStatus`. `source:adopt` moves the project into brownfield/in-progress; `brownfield:baseline` marks the baseline reconciled.

## Static site

The generated site now includes a Brownfield page showing adoption state, inventory/candidate counts, reconciliation status/findings and any normalization proposal.
