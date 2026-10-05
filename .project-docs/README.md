# Project Documentation Governance & Runtime State — v5.6

This folder stores governance/operational/generated state, not product truth.

- `site/`: generated static documentation portal; rebuild with `npm run docs:build`.

- `workplans/`: reviewed implementation plans with context hashes.
- `freshness/`: dependency fingerprints created by explicit documentation reconciliation.
- `changesets/`: semantic batches of canonical documentation changes.
- `audit-state.json`: local comparison state used to detect direct/manual edits.
- `baselines/`: immutable named milestone fingerprints.
- `packs.lock.json`: installed reusable-pack state.
- `pack-snapshots/`: accepted reusable-pack bases for three-way diff.
- `pack-proposals/`: reusable-pack upgrade proposals.

Do not manually edit hashes to bypass stale detection. Keep product/domain behaviour in `docs/`.

## v5.2 Progressive Specification

- `spec-promotions/` stores generated Lightweight → Standard → Full gap reports.
- Promotion reports are review evidence, not canonical product truth.
- Effective spec level remains on the Feature/project profile; WorkPlans snapshot it at planning time.


## Source workspace state (v5.4)

- `source.lock.json` — application source provenance: adopted vs Source Base, base id/version/variant and source root.
- This file is governance state. The `application` entity remains the canonical app-boundary description and the source tree remains canonical implementation.

## Local intelligence state (v5.5)

`indexes/` contains rebuildable entity, relation, search and source indexes. `reports/` contains generated context/Git-impact outputs. These files are operational caches/evidence and are never canonical business truth.


## Workspace runtime state (v5.6)

The generated static site moved from root `site/` to `.project-docs/site/`. This keeps the repository root focused on entry files, project knowledge, implementation, kit assets, and tooling. The site remains derived and may be deleted/rebuilt safely.
