# v5.2 QA Report

## Scope

Regression coverage for Progressive Specification plus all v5.1 governance capabilities.

## Source workspace result

```text
Registry check:        PASS
Entity types:          31
Relation rules:        36
Quality rules:         9
Applicable standards:  17
Reusable packs:        2 / 2 PASS
Docs validation:       0 errors / 0 warnings
Static site links:     0 broken
```

Starter workspace correctly contains zero project-domain entities; E2E fixtures provide real graph coverage.

## Progressive Specification regression

PASS:

- Lightweight Feature passes `spec:check` with minimum sections.
- Lightweight Ready Gate passes without separate Requirement/Test entities.
- Standard promotion reports missing Requirement/Test relations.
- Promotion `--apply` is blocked while target gaps remain.
- Promotion applies after gaps are resolved without changing Feature identity.
- `auto` recommendation escalates payment work to Full.
- `riskEscalation=block` blocks an explicitly under-specified high-risk Feature.
- WorkPlan schema 1.1 snapshots Standard spec level/maturity context.
- Static generated specification summary contains Lightweight and Standard Features.

## v5.1 regression retained

PASS:

- dependency freshness and stale detection;
- stale docs block Ready/Done;
- Request promotion;
- WorkPlan `STALE_CONTEXT` protection;
- Task materialization;
- Done reconciliation;
- graph impact analysis;
- semantic ChangeSets;
- Baseline drift detection;
- broken relation negative test.

## QA command

```bash
cd tools
npm ci
npm run qa
```

Final downloadable ZIP is additionally extracted into a clean directory and the same QA command is executed before delivery.
