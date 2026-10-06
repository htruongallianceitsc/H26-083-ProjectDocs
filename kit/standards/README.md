# Standards Architecture v5.12

Standards resolve in this order:

1. **Core Governance** — always applicable.
2. **Project Type** — Web, Mobile and/or API.
3. **Technology Stack** — ReactJS, React Native, Flutter, NodeJS API, ASP.NET Core API, PostgreSQL, etc.
4. **Capability Standard** — cross-project rules such as Authentication.
5. **Project ADR/Exception** — explicit project-specific deviation.

v5.2 introduced Progressive Specification as core governance. v5.3 keeps that behavior and adds repository-entry hygiene so chronological upgrade/QA history no longer dilutes the root entry surface.

Standards define rules. Capability Packs must still comply with applicable standards and the selected spec level must not be used to bypass safety/production requirements.


v5.4 adds `source-workspace.md` and `source-base-governance.md` so implementation roots and bootstrap templates are governed alongside documentation.

## v5.5 additions

- `entity-identity-lifecycle-and-relations.md`
- `source-intelligence.md`
- `local-knowledge-engine.md`

These standards govern permanent entity identity, semantic graph behavior, source evidence, Git impact, local search/query/context, and Doctor repairs.


## v5.6 additions

- Framework assets are physically grouped under `kit/`.
- `starter-kit.json.workspaceLayout` defines canonical workspace paths.
- `.project-docs/site/` is the generated static-site location.
- Root hygiene now distinguishes project truth, source truth, kit assets, tooling, and runtime state.

## v5.12 additions

- `screen-first-wireframe-analysis.md` now distinguishes User Actions, Lifecycle Actions, System Actions and API Interactions.
- Splash/bootstrap and automatic navigation/loading behaviour can be represented without inventing buttons.
- Accepted wireframe gaps can create authoring-gated multi-entity promotion plans.
- Startup/bootstrap preset suggests Feature/Screen/Requirement/Flow/API/Test coverage and unresolved questions.
- Promotion apply protects existing canonical entity codes by default.

## v5.11 additions

- Screen-first analysis is optional rather than a mandatory stage.
- Text-based Screen contracts are the semantic projection layer.
- ASCII and combined HTML are generated views over the same contract.
- Accepted review gaps must update canonical Screen/Feature/Requirement/Rule/Flow docs; generated wireframes never become source of truth.

## v5.10 additions

- `mockup-driven-documentation.md`
- `mockups/` is a governed design-evidence input root.
- Vision analysis is review-gated before Screen promotion.
- Existing Screen docs are proposal-first rather than automatically overwritten.
- Mockup traceability/drift becomes part of QA when images exist.
