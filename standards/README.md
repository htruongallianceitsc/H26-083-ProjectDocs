# Standards Architecture v5.2

Standards resolve in this order:

1. **Core Governance** — always applicable.
2. **Project Type** — Web, Mobile and/or API.
3. **Technology Stack** — ReactJS, React Native, Flutter, NodeJS API, ASP.NET Core API, PostgreSQL, etc.
4. **Capability Standard** — cross-project rules such as Authentication.
5. **Project ADR/Exception** — explicit project-specific deviation.

v5.2 adds Progressive Specification as core governance: documentation depth is resolved before detailed decomposition, while freshness, impact, ChangeSet/Baseline and reuse governance remain active at every depth.

Standards define rules. Capability Packs must still comply with applicable standards and the selected spec level must not be used to bypass safety/production requirements.
