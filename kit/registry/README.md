# Registry Governance — v5.6

`kit/registry/*.json` is the canonical machine-readable policy source.

Important files:

- `entity-types.json`
- `relation-map.json`
- `quality-rules.json`
- `readiness-rules.json`
- `spec-profiles.json` — Progressive Specification levels, maturity minimums and risk escalation rules.
- `freshness-rules.json`
- `impact-rules.json`
- `workplan.schema.json`
- `frontmatter-schema.json`
- `project-profile.schema.json`
- project type / technology stack / reuse / traceability registries

Generated YAML mirrors live under `kit/registry/_generated/` and must not be edited manually.

```bash
cd tools
npm run registry:sync
npm run registry:check
```

Ready/Done, spec depth, freshness, impact and reuse semantics remain policy-driven rather than prompt-driven.


## Source workspace registry (v5.4)

- `source-profiles.json` — canonical stack/application bootstrap profiles.
- `source-base.schema.json` — Source Base manifest contract.
- `source-profiles.yaml` under `_generated/` is derived and must not be edited manually.

## Model and intelligence registry (v5.5)

- `entity-policy.json` defines permanent UID, revision, lifecycle and relation enforcement policy.
- `entity-types.json` now contains explicit `initialStatus`, `transitions` and `terminalStatuses`.
- `relation-map.json` now contains semantic relation/reverse names, min/max cardinality, unresolved-target policy and fallback markers.
- `source-intelligence.json` controls source scan/mapping/Git defaults.
- `local-engine.json` controls derived local indexes, search/query and context defaults.
- `views.json` stores reusable local query views.

Generated YAML mirrors remain non-authoritative. Edit JSON sources, then run `npm run registry:sync`.


## Workspace layout registry (v5.6)

The physical repository layout is configured in root `starter-kit.json.workspaceLayout`. Registry JSON remains under `kit/registry/`; tools should resolve the canonical path through the common workspace-layout helper instead of introducing new hard-coded root paths. `legacyLayoutAliases` exists only for controlled migration compatibility.
