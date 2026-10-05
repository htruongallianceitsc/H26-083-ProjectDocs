---
code: DOC-SEC-AUTHENTICATION
type: document
title: Authentication
status: draft
owner: Backend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [security, auth]
related:
  modules: [MOD-AUTH]
  features: []
  requirements: []
  business_rules: [BR-AUTH-001, BR-AUTH-002]
  screens: []
  flows: []
  apis: []
  database_objects: []
  tests: []
  decisions: [ADR-002]
  integrations: []
  nfrs: [NFR-SEC-001]
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

# Authentication

## Mechanism
Email + password login issuing a JWT access token (15-minute lifetime, `NFR-SEC-001`) plus an httpOnly, `Secure`, `SameSite=Strict` refresh-token cookie (30-day lifetime), per `ADR-002`.

## Password Storage
Bcrypt, cost factor 12 (`BR-AUTH-001`). Raw passwords are never logged or persisted.

## Account Protection
5 consecutive failed logins within 15 minutes locks the account for 15 minutes (`BR-AUTH-002`).

## Session Lifecycle
Login/register issue a session; logout revokes the refresh token (`DB-REFRESH-TOKEN.revoked_at`); access-token expiry requires a silent refresh using the refresh cookie (refresh endpoint detail is an implementation concern of the SPA's API client, not separately itemized as a numbered API in this round since it reuses the login issuance path).

## Password Reset
Single-use, time-limited token delivered by email (`FEAT-AUTH-FORGOT-PASSWORD`), anti-enumeration response behavior on `API-AUTH-FORGOT-PASSWORD`.

## Out of Scope (v1)
No SSO/SAML/OAuth third-party login, no multi-factor authentication, no "remember me" extended session.
