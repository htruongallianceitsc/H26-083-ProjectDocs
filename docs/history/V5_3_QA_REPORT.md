# v5.3 QA Report

## Scope

v5.3 validates repository-entry cleanup without changing the v5.2 Progressive Specification or v5.1 governance semantics.

## Source workspace result

Full QA command:

```bash
cd tools
npm ci
npm run qa
```

Result:

- Registry check: 0 errors.
- Entity types: 31.
- Relation rules: 36.
- Quality rules: 9.
- Applicable core standards: 18.
- Reusable packs: 2/2 valid.
- Documentation validation: 0 errors / 0 warnings.
- Static site: 0 broken links.
- Starter workspace remains intentionally empty of project entities.

## Root-history hygiene regression

E2E creates a synthetic `V99_UPGRADE_NOTES.md` at repository root and requires validation to fail with `ROOT_HISTORY_DOC`. The file is then removed and normal validation must pass again.

Result: PASS.

## Historical move coverage

Historical version/transition records were moved to `docs/history/`, including:

- `REVIEW_UPGRADE_NOTES.md`
- `V3_CAPABILITY_PACK_UPGRADE.md`
- v4 / v4.1 upgrade notes and QA reports
- v5.0 / v5.1 / v5.2 upgrade notes and QA reports

`REUSE_STRATEGY_V4.md` intentionally remains at root because it is still a current strategy/reference document rather than historical release evidence.

## Regression retained

The complete E2E suite also passed:

- Lightweight Ready without separate Requirement/Test entities;
- Standard promotion gap detection and apply guard;
- Auto risk recommendation and escalation blocking;
- mode-aware Ready/Done;
- dependency freshness and stale gate blocking;
- Request → WorkPlan → Task flow;
- WorkPlan stale-context protection;
- graph impact analysis;
- semantic ChangeSets;
- Baseline drift detection;
- broken relation negative validation.

## Packaging acceptance

The release ZIP must be extracted to a clean directory and pass `npm ci && npm run qa` before delivery.
