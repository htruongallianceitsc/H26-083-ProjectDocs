# Registry Governance - v4.1

`registry/*.json` is the only canonical machine-readable registry source.

Canonical files include:
- `entity-types.json`
- `relation-map.json`
- `quality-rules.json`
- `project-types.json`
- `technology-stacks.json`
- `core-standards.json`
- `reuse-policy.json`
- `traceability-profiles.json`
- `frontmatter-schema.json`
- `capability-pack.schema.json`
- `project-profile.schema.json`

Human-readable YAML mirrors are generated into `registry/_generated/` and must never be edited manually.

```bash
cd tools
npm run registry:sync
npm run registry:check
```

The CI/QA flow runs `registry:check` before documentation validation so JSON/YAML drift cannot silently reappear.
