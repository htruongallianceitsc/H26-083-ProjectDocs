# Standards Architecture v5.3

Standards resolve in this order:

1. **Core Governance** — always applicable.
2. **Project Type** — Web, Mobile and/or API.
3. **Technology Stack** — ReactJS, React Native, Flutter, NodeJS API, ASP.NET Core API, PostgreSQL, etc.
4. **Capability Standard** — cross-project rules such as Authentication.
5. **Project ADR/Exception** — explicit project-specific deviation.

v5.2 introduced Progressive Specification as core governance. v5.3 keeps that behavior and adds repository-entry hygiene so chronological upgrade/QA history no longer dilutes the root entry surface.

Standards define rules. Capability Packs must still comply with applicable standards and the selected spec level must not be used to bypass safety/production requirements.
