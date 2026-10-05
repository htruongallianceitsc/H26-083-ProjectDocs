---
code: FEAT-AUTH-LOGIN
type: feature
title: Login / Logout
status: draft
owner: Backend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [auth]
related:
  modules: [MOD-AUTH]
  features: []
  requirements: [REQ-AUTH-002]
  business_rules: [BR-AUTH-002]
  screens: [SCR-LOGIN]
  flows: [FLOW-AUTH-LOGIN]
  apis: [API-AUTH-LOGIN, API-AUTH-LOGOUT]
  database_objects: [DB-USER, DB-REFRESH-TOKEN]
  tests: [TC-AUTH-LOGIN-001]
  decisions: [ADR-002]
---

# Feature Specification

## 1. Overview
A registered user signs in with email/password to obtain a session, and can sign out to end it.

## 2. Business Goal
Secure, low-friction access to the product for returning users.

## 3. Actors
Registered user.

## 4. Preconditions
User has a registered account (`FEAT-AUTH-REGISTER`).

## 5. Trigger
User opens `/login` and submits credentials (login), or clicks "Sign out" from the account menu (logout).

## 6. Main Flow
1. User enters email/password on `SCR-LOGIN`.
2. Client calls `API-AUTH-LOGIN`.
3. Server verifies credentials, issues a short-lived JWT access token (body) and sets a long-lived refresh token (httpOnly cookie), per `ADR-002` and `FLOW-AUTH-LOGIN`.
4. Client redirects to the last-used Workspace (or workspace picker if the user has multiple/none).

## 7. Alternative Flows
- **Logout**: user clicks sign out; client calls `API-AUTH-LOGOUT`, server revokes the refresh token row, client clears local session state and redirects to `/login`.

## 8. Error / Exception Flows
- Wrong email/password -> `401 INVALID_CREDENTIALS` (generic message — does not reveal whether the email exists).
- Account locked -> `423 ACCOUNT_LOCKED` (`BR-AUTH-002`).

## 9. Business Rules
`BR-AUTH-002`

## 10. Screens / Routes
`SCR-LOGIN`

## 11. APIs
`API-AUTH-LOGIN`, `API-AUTH-LOGOUT`

## 12. Database Objects
`DB-USER`, `DB-REFRESH-TOKEN`

## 13. Permissions
None required for login (anonymous action); logout requires an authenticated session.

## 14. Notifications / External Effects
None.

## 15. Audit / Logging
Failed login attempts are counted per-email for lockout purposes (`BR-AUTH-002`); never logs the submitted password.

## 16. Acceptance Summary
A user with correct, non-locked-out credentials receives a working session; a user can end that session at any time via logout.

## 17. Edge Cases
Logging in again while already logged in simply issues a fresh session (previous refresh token remains valid until it expires or is explicitly revoked — no automatic single-session enforcement in v1).

## 18. Dependencies
`FEAT-AUTH-REGISTER` (account must exist).

## 19. Known Limitations
No "remember me" / extended-session toggle in v1; no multi-device session list/management UI.

## 20. Open Questions
None blocking.
