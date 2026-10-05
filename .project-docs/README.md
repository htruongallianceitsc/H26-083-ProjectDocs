# Project Documentation Governance State — v5.1

This folder stores governance/operational state, not product truth.

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
