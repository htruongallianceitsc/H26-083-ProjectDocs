---
code: DOC-SEC-DATA-SECURITY
type: document
title: Data Security
status: draft
owner: Backend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [security, data]
related:
  modules: []
  features: []
  requirements: []
  business_rules: []
  screens: []
  flows: []
  apis: []
  database_objects: [DB-USER, DB-COMMENT]
  tests: []
  decisions: [ADR-001]
  integrations: []
  nfrs: [NFR-BACKUP-001]
  runbooks: []
  permissions: []
  native_capabilities: []
  deep_links: []
  push_events: []
  local_storage: []
  sync_policies: []
  background_jobs_mobile: []
  analytics_events: []
  feature_flags: []
  device_test_profiles: []
  open_questions: []
  releases: []
---

# Data Security

## Encryption in Transit
All client-API and API-database traffic uses TLS; the WebSocket channel uses `wss://`.

## Encryption at Rest
Managed PostgreSQL provider's at-rest encryption (provider-dependent, assumed enabled per standard managed-database defaults).

## Sensitive Fields
`users.password_hash`, `refresh_tokens.token_hash`, `password_reset_tokens.token_hash` — never logged, never returned in any API response (see each `DB-*` doc's "Sensitive Data / Retention" section).

## Personal Data
`users.email`, `users.display_name`, `workspace_members.invited_email` — accessible only to authorized Workspace members per `docs/10-security/authorization.md`.

## Input Validation
Every API validates request bodies server-side per its documented "Validation" section (`docs/07-api/`); never relies on client-side validation alone.

## Secrets Management
Database credentials, JWT signing secret, and the email provider API key are environment-specific configuration, never committed to source control (`standards/security-and-secrets.md`).

## Backup / Retention
See `NFR-BACKUP-001` and `docs/08-database/database-overview.md`.
