# v5.10 Upgrade Notes — Mockup-Driven Documentation

## Problem

v5.9 had strong Screen/Requirement/Flow/Traceability concepts but no governed path from a folder of UI mockup images into canonical documentation. Teams could manually inspect screenshots, but the starter kit did not inventory images, track image drift, group screen states, enforce vision analysis, or prevent AI from hallucinating hidden backend/business behaviour from pixels.

## Upgrade

v5.10 adds a review-gated mockup ingestion workflow.

### New project evidence root

- `mockups/`

### New runtime state

- `.project-docs/mockups/inventory.json`
- `.project-docs/mockups/analysis-tasks.json`
- `.project-docs/mockups/analysis/`
- `.project-docs/mockups/candidates.json`
- `.project-docs/mockups/proposals/`
- `.project-docs/mockups/report.json`

### New framework assets

- `kit/registry/mockup-workflow.json`
- `kit/registry/mockup-analysis.schema.json`
- `kit/templates/mockup-analysis-template.json`
- `kit/prompts/46-mockup-to-documentation.md`
- `kit/standards/mockup-driven-documentation.md`
- `kit/workflows/21-mockup-to-documentation.md`

### New commands

```bash
npm run mockup:inventory
npm run mockup:tasks
npm run mockup:candidates
npm run mockup:review -- --candidate ... --decision accepted --reviewer ...
npm run mockup:promote -- --candidate ...
npm run mockup:report
npm run mockup:check
npm run mockup:status
```

## Safety model

- Mockups are design evidence, not behavioural truth.
- Vision analysis is required before promotion by default.
- Candidate review is mandatory.
- Existing Screen documents are proposal-first, not auto-overwritten.
- API/DB/hidden rule/permission inference from mockups is explicitly prohibited.
- Changed image hashes trigger reconciliation findings.

## Compatibility

Projects without files under `mockups/` continue to pass `mockup:check` with zero assets. Existing v5.9 project knowledge remains valid.
