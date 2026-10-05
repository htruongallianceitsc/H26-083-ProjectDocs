# Registry Governance — v5.2

`registry/*.json` is the canonical machine-readable policy source.

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

Generated YAML mirrors live under `registry/_generated/` and must not be edited manually.

```bash
cd tools
npm run registry:sync
npm run registry:check
```

Ready/Done, spec depth, freshness, impact and reuse semantics remain policy-driven rather than prompt-driven.
