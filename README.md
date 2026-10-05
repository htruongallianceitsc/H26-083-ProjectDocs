# Production Project Documentation Starter Kit v4.1

Documentation-first starter kit for long-lived production Web, Mobile and API projects.

## Core model

```text
Core Governance Standards
        ↓
Project Type Standards (web/mobile/api)
        ↓
Technology Standards (ReactJS/React Native/Flutter/NodeJS/.NET/PostgreSQL)
        ↓
Reuse Decision (Standard / Pattern Pack / Capability Pack)
        ↓
Project-local canonical documentation
        ↓
Typed traceability + validation + static documentation portal
```

## What v4.1 changes

V4.1 is a stabilization release. It does not introduce Task/WorkPlan entities yet. It focuses on making the existing v4 foundation deterministic before v5.0:

- one canonical starter version (`4.1.0`);
- JSON-only canonical registries, with generated YAML mirrors;
- one active NodeJS runtime/toolchain;
- one canonical `implementationGate` profile contract;
- aligned Capability/Pattern Pack manifest schema;
- executable E2E regression fixture with real entities and typed edges;
- real GitHub Actions workflow running the full QA gate.

## Start

1. Read `START_HERE.md`.
2. Configure `project.profile.json`.
3. Run `cd tools && npm run registry:check && npm run profile:check`.
4. Follow workflows 01 -> 03A -> 03/04 -> quality/production readiness.
5. Before generating repeated modules, inspect `reusable-modules/` and `reusable-patterns/`.
6. Run `npm run qa` before implementation/release reviews or starter-kit packaging.

## Source of truth

- Project documentation: project-local Markdown under `docs/`.
- Machine-readable registries: canonical JSON under `registry/`.
- YAML registry views: generated only under `registry/_generated/`.
- Runtime: `tools/scripts/docs-tool.mjs`, `pack-tool.mjs`, and `registry-tool.mjs` using `tools/lib/common.mjs`.
- Reuse state: `.project-docs/` lock/snapshots/proposals.

## Reuse

- `standards/` says how a good feature/system must behave.
- `reusable-patterns/` provides reusable skeletons.
- `reusable-modules/` provides versioned reusable capabilities.
- Project docs are always source of truth after import.

See `REUSE_STRATEGY_V4.md`, `CAPABILITY_PACKS.md`, `V4_UPGRADE_NOTES.md`, `V4_1_UPGRADE_NOTES.md`, and `V4_1_QA_REPORT.md`.
