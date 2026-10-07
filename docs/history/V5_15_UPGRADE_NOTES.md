# v5.15 Upgrade Notes — Project Documentation Bundle

## Objective

Make migration of project documentation between starter-kit versions simple for the user: export one portable ZIP from the old project and import it into a project created from the new starter.

## Added

- `tools/scripts/bundle-tool.mjs`
- `tools/lib/zip.mjs` (dependency-free ZIP writer/reader using Node built-ins)
- `kit/registry/documentation-bundle.json`
- `docs/guides/documentation-bundles.md`
- `kit/workflows/25-documentation-bundle-transfer.md`
- `docs:export`, `docs:import`, `docs:bundle:inspect`, `docs:bundle:check` commands
- import reports under `.project-docs/imports/`
- export ZIPs under `.project-docs/exports/`
- bundle E2E coverage

## Bundle contract

`project-documentation-bundle` schema v1 is versioned independently from the starter kit. It carries normalized typed entities, relations, integrity hashes, source starter metadata and source project context.

## Import behavior

- maps entities through current target registry configuration;
- preserves UID/code/revision;
- creates deterministic UID for legacy entities without one;
- skips identical entities on repeat import;
- reports conflicts instead of overwriting by default;
- supports explicit `--on-conflict replace`;
- runs post-import validate/reindex/sync/build/link-check by default.

## Upgrade impact

No existing canonical docs need to be rewritten to upgrade the starter itself. This capability becomes useful when project documentation must be transferred into a newer clean starter workspace.
