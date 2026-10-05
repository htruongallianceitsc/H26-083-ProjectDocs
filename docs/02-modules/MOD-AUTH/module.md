---
code: MOD-AUTH
type: module
title: Authentication & Account
status: draft
owner: Backend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [auth, security]
related:
  modules: []
  features: [FEAT-AUTH-REGISTER, FEAT-AUTH-LOGIN, FEAT-AUTH-FORGOT-PASSWORD]
  requirements: []
  business_rules: []
  screens: []
  flows: []
  apis: []
  database_objects: [DB-USER, DB-REFRESH-TOKEN, DB-PASSWORD-RESET-TOKEN]
  tests: []
  decisions: [ADR-002]
---

# Module

## Purpose
Owns the account lifecycle (register, login/logout, forgot/reset password) and issues the session credential (JWT access token + refresh token) that every other module relies on for authentication.

## Scope
Registration, login, logout, and password reset. Does not include profile editing, account deletion, or SSO (future items).

## Feature Inventory

| Feature Code | Title | Priority | Status |
|---|---|---|---|
| FEAT-AUTH-REGISTER | Register | P0 | draft |
| FEAT-AUTH-LOGIN | Login / Logout | P0 | draft |
| FEAT-AUTH-FORGOT-PASSWORD | Forgot / Reset Password | P1 | draft |

## Shared Concepts
- A `User` row (`DB-USER`) is the root identity every other entity (Workspace membership, Card authorship, Comments) references.
- Session = short-lived JWT access token (returned in the response body) + long-lived refresh token (httpOnly cookie), per `ADR-002`.

## Dependencies
None (root module — every other module depends on this one for identity).

## Owners
Backend Team.
