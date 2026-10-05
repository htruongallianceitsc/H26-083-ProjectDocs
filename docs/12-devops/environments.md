---
code: DOC-ENVIRONMENTS
type: document
title: Environments
status: draft
owner: Engineering Lead
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [devops, environments]
related:
  modules: []
  features: []
  requirements: []
  business_rules: []
  screens: []
  flows: []
  apis: []
  database_objects: []
  tests: []
  decisions: []
---

# Environments

| Environment | Purpose | Data | Deployment | Access |
|---|---|---|---|---|
| Local | Developer machine, Docker Compose PostgreSQL | Fake/seeded | Manual (`npm run dev`) | Developer |
| DEV | Shared integration testing for in-progress work | Fake/sanitized | Auto-deploy on merge to `main` | Engineering team |
| UAT/Staging | Pre-release acceptance testing, mirrors PROD config | Sanitized copy of PROD schema with fake data | CI/CD, manual trigger | Engineering + Product/QA |
| PROD | Live customer-facing environment | Real | Release pipeline with manual approval gate | Restricted (Engineering Lead + on-call) |

Each environment above UAT has its own PostgreSQL database instance, its own `INT-EMAIL` provider sandbox/API key, and its own JWT signing secret (`ADR-002`) — secrets are never shared across environments.
