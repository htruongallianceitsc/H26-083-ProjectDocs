# Production Project Documentation Starter Kit v5.18

Documentation-first starter kit for long-lived Web, Mobile and API projects. It combines canonical project docs, reusable standards/packs, requirement-driven governance, source-workspace guidance, generated review projections and deterministic QA.

## v5.18 highlights

v5.18 focuses on **Repository Hygiene & Deterministic Build**:

- `npm run qa` is idempotent for tracked generated JSON: unchanged semantic payload keeps the existing `generatedAt` and is not rewritten.
- Root `.gitignore` and `.editorconfig` are now part of the starter.
- Disposable generated output (`.project-docs/site`, indexes, reports, export/import/cache folders) is intentionally ignored and rebuilt on demand/CI.
- The accidental root `package-lock.json` is removed; `tools/package-lock.json` is the only npm lockfile.
- Generated site branding reads the current starter version from `starter-kit.json` instead of hard-coding an older version.
- Repository entry responsibilities are explicit: README = landing page, `START_HERE.md` = operating workflow, `PROJECT_BLUEPRINT.md` = progressive project specification.

Full release history lives in `docs/history/`.

## Core model

```text
Raw request / idea / Mockups / Visual Evidence
       ↓
Request analysis & promotion
       ↓
Module / Feature / Requirement / Rule
       ↓
Screen / API / DB / Test / Task / Decision
       ↓
Reviewed WorkPlan
       ↓
Implementation + Ready/Done gates
       ↓
Deterministic generated projections / CI artifacts
```

## Start here

1. Read `START_HERE.md` for the operational workflow.
2. Configure `project.profile.json`.
3. Use `PROJECT_BLUEPRINT.md` for early/lightweight project knowledge and progressive promotion.
4. Keep canonical documentation under `docs/`; reusable framework assets live under `kit/`.

## Quick QA

Requires Node.js 20+ for the documentation toolchain.

```bash
cd tools
npm ci
npm run qa
```

A second `npm run qa` with unchanged inputs should not modify tracked files.

## Workspace layout

```text
docs/               canonical project/business knowledge
kit/                standards, registries, prompts, templates, workflows, reuse packs
apps/ packages/     implementation workspace
tests/ infra/       tests and infrastructure
mockups/            governed design evidence
tools/              local documentation/project tooling
.project-docs/      runtime/governance/generated state
```

Generated artifact policy: `kit/standards/generated-artifacts-policy.md`.

## Documentation migration

The Project Documentation Bundle introduced in v5.15 remains the supported transport for moving canonical project knowledge from older starter versions into the current structure. See `docs/guides/documentation-bundles.md`.

## Important entry points

- `START_HERE.md` — how to operate the starter kit.
- `PROJECT_BLUEPRINT.md` — progressive project specification/inventory.
- `docs/` — canonical project documentation.
- `kit/standards/` — reusable project/engineering standards.
- `kit/reuse/` — capability and pattern reuse library.
- `tools/README.md` — CLI/tooling reference.
- `docs/history/` — upgrade notes and QA history.
