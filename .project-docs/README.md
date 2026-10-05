# Project Documentation Governance State

This folder stores non-business governance state for reusable packs.

- `packs.lock.json`: installed pack version, variables, enabled features, namespace and review state.
- `pack-snapshots/`: accepted base content for three-way diff.
- `pack-proposals/`: upgrade proposals.

Do not move product/business facts here. Do not add pack version/provenance to business frontmatter unless it is itself a business fact.
