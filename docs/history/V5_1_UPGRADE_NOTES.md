# v5.1 Upgrade Notes

## Goal

V5.1 strengthens long-lived documentation governance after v5.0 established the Request → Ready Gate → WorkPlan → Task bridge.

The roadmap milestone is:

```text
Dependency-aware freshness
+ Semantic ChangeSets
+ Named Baselines
+ Stronger graph impact analysis
```

## Dependency-aware freshness

New registry: `registry/freshness-rules.json`.

New commands:

```bash
npm run doc:check -- --entity FEAT-...
npm run doc:reconcile -- --entity FEAT-... --reviewer "..." --note "..."
```

A reconciliation stores hashes of the document and configured dependencies. Later dependency content/relation changes mark the document `STALE`.

Default adoption behavior:

- `UNTRACKED`: visible, non-blocking;
- `FRESH`: pass;
- `SELF_CHANGED`: visible review signal;
- `STALE`: blocks Ready/Done and quality validation when enabled by project profile.

## Semantic ChangeSets

New state folders:

- `.project-docs/changesets/`
- `.project-docs/audit-state.json`

Commands:

```bash
npm run audit:init -- --actor "..."
npm run changeset:scan -- --actor "..." --reason "..." --related FEAT-...
npm run changeset:list
npm run changeset:show -- --id CHG-...
```

ChangeSets capture added/modified/deleted canonical artifacts with entity metadata, before/after hashes and text snapshots.

## Baselines

New folder: `.project-docs/baselines/`.

```bash
npm run baseline:create -- --name UAT-1 --actor "..." --note "..."
npm run baseline:list
npm run baseline:compare -- --name UAT-1
```

Use Baselines for UAT, production releases, migrations, or major refactors.

## Impact analysis

New registry: `registry/impact-rules.json`.

```bash
npm run impact -- --entity REQ-...
npm run impact -- --entity API-... -- --depth 2
```

The engine traverses actual typed relations in both configured directions, scores potential impact, and returns HIGH/MEDIUM/LOW candidates with path evidence.

## Gate changes

Ready and Done now include a freshness check. Existing projects are not immediately blocked because untracked documents are allowed; after a Feature is reconciled, dependency drift becomes enforceable.

## Static site

The Governance page now shows stale-document counts, ChangeSets and Baselines in addition to Requests/WorkPlans/Tasks/Bugs.

## Intentionally deferred

V5.1 still does not scan source code, Git dependencies, OpenAPI, database schema or executable tests. Those remain v6.0 scope.
