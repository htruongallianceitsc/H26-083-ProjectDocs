# FILE CATALOG — Starter Kit v3

Total files after generated static-site build: **432**.

## By area

- `.project-docs`: 4 — pack lock, snapshots/proposals placeholders and governance README.
- `docs`: 21 — project documentation roots + generated indexes.
- `prompts`: 29 — end-to-end, profile, mobile/backend and capability-pack prompts.
- `registry`: 10 — entity/relation/quality/profile/stack/core-standard/capability-pack schemas.
- `reusable-modules`: 16 — reusable library + runnable `auth-standard@1.0.0` sample.
- `root`: 10 — entry docs, profile example, starter metadata and v3 notes.
- `site`: 189 — generated static documentation portal after the current build.
- `standards`: 85 — core, project-type, technology-stack and reuse standards.
- `templates`: 33 — project/mobile/governance/capability-pack templates.
- `tools`: 22 — zero-dependency NodeJS profile/docs/pack toolchain.
- `workflows`: 13 — Idea -> Production + Mobile + Capability Pack lifecycle.

> `site/` and `docs/_generated/` are derived. Exact total can change after rebuilding the static site.

## v3 capability-pack files

- `starter-kit.json`
- `CAPABILITY_PACKS.md`
- `V3_CAPABILITY_PACK_UPGRADE.md`
- `.project-docs/packs.lock.json`
- `registry/capability-pack.schema.json`
- `registry/core-standards.json`
- `standards/reuse/capability-pack-standard.md`
- `workflows/12-capability-pack-lifecycle.md`
- `prompts/26-capability-pack-design.md`
- `prompts/27-capability-pack-import-review.md`
- `prompts/28-capability-pack-upgrade-review.md`
- `templates/capability-pack-manifest.example.json`
- `reusable-modules/auth-standard/manifest.json`
- `tools/src/pack-validate.mjs`
- `tools/src/pack-import.mjs`
- `tools/src/pack-diff.mjs`
- `tools/src/pack-upgrade.mjs`
- `tools/src/pack-review.mjs`
- `tools/src/lib/packs.mjs`
- `tools/src/lib/pack-diff.mjs`

## Main registries

- `registry/core-standards.json` — standards always applied.
- `registry/project-types.json` — Web/Mobile/API standards.
- `registry/technology-stacks.json` — ReactJS, React Native, Flutter, NodeJS API, ASP.NET Core API, PostgreSQL.
- `registry/entity-types.json` — entity lifecycle/type registry.
- `registry/relation-map.json` — typed relation/cardinality policy.
- `registry/quality-rules.json` — profile-aware quality gates.
- `registry/traceability-profiles.json` — typed traceability paths.

## Entry points

1. `README.md`
2. `START_HERE.md`
3. `PROJECT_PROFILE.example.json`
4. `PROJECT_BLUEPRINT.md`
5. `CAPABILITY_PACKS.md` when reusing a repeated capability.
6. `tools/README.md` for commands.
