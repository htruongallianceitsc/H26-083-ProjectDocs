# Semantic Change History and Baselines — v5.2

## Purpose

Git answers which files changed. ChangeSets and Baselines add project-document semantics: entity codes/types, actor, reason, related references, and stable snapshots for UAT/release comparison.

## ChangeSet

A ChangeSet is stored in `.project-docs/changesets/` and records a semantic batch of added/modified/deleted canonical files with before/after hashes and content snapshots.

Recommended workflow:

```bash
npm run audit:init -- --actor "Team"
# edit canonical docs / requests / workplans
npm run changeset:scan -- --actor "Team" --reason "Add Google login" --related FEAT-AUTH-LOGIN
```

Do not include generated site/report files in ChangeSets.

## Baseline

A Baseline is an immutable named fingerprint under `.project-docs/baselines/`.

Use at meaningful boundaries such as:

- UAT handoff;
- production release;
- pre-migration;
- before a major capability-pack upgrade.

```bash
npm run baseline:create -- --name UAT-1 --actor "PM" --note "UAT handoff"
npm run baseline:compare -- --name UAT-1
```

A baseline comparison reports added/modified/deleted canonical artifacts without mutating the project.
