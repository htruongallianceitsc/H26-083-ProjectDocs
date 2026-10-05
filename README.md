# Production Project Documentation Starter Kit v4

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

## Start
1. Read `START_HERE.md`.
2. Configure `project.profile.json`.
3. Run `cd tools && npm run profile:check`.
4. Follow workflows 01 -> 03A -> 03/04 -> quality/production readiness.
5. Before generating repeated modules, inspect `reusable-modules/` and `reusable-patterns/`.
6. Run `npm run docs:all` before implementation/release reviews.

## Reuse
- `standards/` says how a good feature/system must behave.
- `reusable-patterns/` provides reusable skeletons.
- `reusable-modules/` provides versioned reusable capabilities.
- Project docs are always source of truth after import.

See `REUSE_STRATEGY_V4.md`, `CAPABILITY_PACKS.md` and `V4_UPGRADE_NOTES.md`.
