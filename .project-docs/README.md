# Project Documentation Governance State

This folder contains project-local governance state that is version-controlled but is not business documentation.

- `packs.lock.json`: imported capability pack identity, version, selected features, variables, code map and base hashes.
- `pack-snapshots/`: immutable rendered base snapshots used for three-way upgrade comparison.
- `pack-proposals/`: generated upgrade proposals and conflict reports. Proposals may be deleted after review/merge.

Do not put secrets here. Do not treat this folder as product/business source of truth.
