# Registry Governance — v5.1

`registry/*.json` is the only canonical machine-readable registry source.

Core canonical files include:

- `entity-types.json`
- `relation-map.json`
- `quality-rules.json`
- `readiness-rules.json`
- `freshness-rules.json`
- `impact-rules.json`
- `workplan.schema.json`
- `frontmatter-schema.json`
- `project-profile.schema.json`
- project type / technology stack / reuse / traceability registries

Human-readable YAML mirrors are generated into `registry/_generated/` and must never be edited manually.

```bash
cd tools
npm run registry:sync
npm run registry:check
```

V5.1 keeps Ready/Done, freshness and impact semantics policy-driven rather than embedding project-specific rules in prompts.
