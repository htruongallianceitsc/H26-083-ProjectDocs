# Generated Artifacts Policy

## Purpose

Keep canonical project knowledge reviewable while preventing reproducible build output from polluting Git history or making QA dirty a clean working tree.

## Artifact classes

### 1. Canonical / durable — track in Git

Track business/project documentation, starter-kit policy, source configuration, reviewed WorkPlans, ChangeSets, baselines, source locks and other governance records that represent durable decisions or source-of-truth state.

### 2. Deterministic review projections — may be tracked

`docs/_generated/` and workflow review summaries under `.project-docs/blueprint/`, `.project-docs/mockups/` and `.project-docs/wireframes/` may be tracked when they materially help code review or offline inspection. They remain derived, never canonical.

If a tracked generated artifact contains `generatedAt`, the generator must preserve the existing timestamp when semantic payload is unchanged. Running QA twice without input changes must not rewrite tracked files.

### 3. Disposable build/runtime output — do not track

The following are reproducible and ignored at repository root:

- `.project-docs/site/`
- `.project-docs/indexes/`
- `.project-docs/reports/`
- `.project-docs/exports/`
- `.project-docs/imports/`
- `.project-docs/cache/`
- dependency/cache/log output such as `node_modules/`, `.cache/`, `*.log`

CI may rebuild and publish the static site as an artifact. Local tools must recreate missing indexes/reports when needed.

## Deterministic-build rule

For unchanged canonical inputs:

```text
npm run qa
npm run qa
```

The second run must leave no tracked-file diff. Timestamps are metadata, not semantic content, and must not by themselves force a rewrite.
