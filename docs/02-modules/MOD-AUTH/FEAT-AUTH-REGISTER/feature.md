---
code: FEAT-AUTH-REGISTER
type: feature
title: Register
status: draft
owner: Backend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [auth]
related:
  modules: [MOD-AUTH]
  features: []
  requirements: [REQ-AUTH-001]
  business_rules: [BR-AUTH-001]
  screens: [SCR-REGISTER]
  flows: []
  apis: [API-AUTH-REGISTER]
  database_objects: [DB-USER]
  tests: [TC-AUTH-REGISTER-001]
  decisions: []
---

# Feature Specification

## 1. Overview
A new user creates an account with email, password, and display name.

## 2. Business Goal
Let anyone self-serve into the product without an invite being required first (a user later joins/creates Workspaces separately).

## 3. Actors
Anonymous visitor.

## 4. Preconditions
None — this is the entry point for new users.

## 5. Trigger
Visitor opens `/register` and submits the form.

## 6. Main Flow
1. Visitor enters email, password, display name on `SCR-REGISTER`.
2. Client calls `API-AUTH-REGISTER`.
3. Server validates input, hashes the password (`BR-AUTH-001`), creates the `DB-USER` row, and returns a session (access token + refresh cookie) — the user is immediately logged in.
4. Client redirects to the "create your first workspace" step (`FEAT-WORKSPACE-CREATE`).

## 7. Alternative Flows
None.

## 8. Error / Exception Flows
- Email already registered -> `409 EMAIL_ALREADY_EXISTS`, form shows inline error with a link to `/login`.
- Password fails policy -> `400 VALIDATION_ERROR` with field-level detail (`BR-AUTH-001`).

## 9. Business Rules
`BR-AUTH-001`

## 10. Screens / Routes
`SCR-REGISTER`

## 11. APIs
`API-AUTH-REGISTER`

## 12. Database Objects
`DB-USER`

## 13. Permissions
None required (anonymous action).

## 14. Notifications / External Effects
None in v1 (no welcome email).

## 15. Audit / Logging
Standard request logging; password value is never logged.

## 16. Acceptance Summary
A visitor can create an account with a unique email and a policy-compliant password and is logged in immediately afterward.

## 17. Edge Cases
Email comparison is case-insensitive (`user@x.com` and `User@X.com` are the same account).

## 18. Dependencies
None.

## 19. Known Limitations
No email verification step in v1 — an account is usable immediately without confirming the email address (tracked as a future hardening item).

## 20. Open Questions
None blocking.
