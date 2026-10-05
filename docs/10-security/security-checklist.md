---
code: DOC-SEC-CHECKLIST
type: document
title: Security Checklist
status: draft
owner: Engineering Lead
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [security, checklist]
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
  integrations: []
  nfrs: []
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

# Security Checklist

Reviewed before each production release:

- [ ] All passwords hashed with bcrypt cost 12, never logged (`BR-AUTH-001`).
- [ ] Account lockout active after 5 failed logins (`BR-AUTH-002`).
- [ ] JWT access token expiry 15 minutes; refresh token httpOnly/Secure/SameSite=Strict (`ADR-002`, `NFR-SEC-001`).
- [ ] Every mutating API enforces server-side Workspace/role authorization (`docs/10-security/authorization.md`).
- [ ] No secrets committed to source control; all secrets sourced from environment configuration (`standards/security-and-secrets.md`).
- [ ] TLS enforced on all client-API and API-database traffic.
- [ ] Forgot-password endpoint gives an identical response regardless of whether the email exists (anti-enumeration, `FEAT-AUTH-FORGOT-PASSWORD`).
- [ ] Sensitive fields (`password_hash`, token hashes) never appear in any API response or log line.
- [ ] Dependency vulnerability scan run before release.
- [ ] Rate limiting active on auth endpoints (`docs/07-api/API-AUTH-LOGIN.md`, `API-AUTH-REGISTER.md`, `API-AUTH-FORGOT-PASSWORD.md`).
