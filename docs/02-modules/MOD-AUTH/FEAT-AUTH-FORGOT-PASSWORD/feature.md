---
code: FEAT-AUTH-FORGOT-PASSWORD
type: feature
title: Forgot / Reset Password
status: draft
owner: Backend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [auth]
related:
  modules: [MOD-AUTH]
  features: []
  requirements: [REQ-AUTH-003]
  business_rules: [BR-AUTH-001]
  screens: [SCR-FORGOT-PASSWORD]
  flows: []
  apis: [API-AUTH-FORGOT-PASSWORD, API-AUTH-RESET-PASSWORD]
  database_objects: [DB-USER, DB-PASSWORD-RESET-TOKEN]
  tests: [TC-AUTH-FORGOT-PASSWORD-001]
  decisions: []
---

# Feature Specification

## 1. Overview
A user who forgot their password requests a reset email containing a single-use link, then sets a new password.

## 2. Business Goal
Let users recover account access without support intervention.

## 3. Actors
Anonymous visitor who owns the account email.

## 4. Preconditions
Account exists for the submitted email (though the API does not reveal this, per `BR-AUTH-001`-adjacent anti-enumeration behaviour).

## 5. Trigger
User clicks "Forgot password?" on `SCR-LOGIN`, lands on `SCR-FORGOT-PASSWORD`.

## 6. Main Flow
1. User submits their email on `SCR-FORGOT-PASSWORD` -> `API-AUTH-FORGOT-PASSWORD`.
2. Server always responds `200 OK` with a generic "if that email exists, we sent a link" message; if the email does match an account, it creates a `DB-PASSWORD-RESET-TOKEN` row and sends an email via `INT-EMAIL` containing a link with the raw token.
3. User clicks the emailed link, which opens `SCR-FORGOT-PASSWORD` in "set new password" mode with the token in the URL.
4. User submits a new password -> `API-AUTH-RESET-PASSWORD`, which validates the token, updates `password_hash` (`BR-AUTH-001`), marks the token used, and redirects to `/login`.

## 7. Alternative Flows
None.

## 8. Error / Exception Flows
- Expired or already-used token -> `410 TOKEN_EXPIRED_OR_USED` on `API-AUTH-RESET-PASSWORD`; UI prompts the user to request a new link.
- New password fails policy -> `400 VALIDATION_ERROR` (`BR-AUTH-001`).

## 9. Business Rules
`BR-AUTH-001`

## 10. Screens / Routes
`SCR-FORGOT-PASSWORD`

## 11. APIs
`API-AUTH-FORGOT-PASSWORD`, `API-AUTH-RESET-PASSWORD`

## 12. Database Objects
`DB-USER`, `DB-PASSWORD-RESET-TOKEN`

## 13. Permissions
None required (anonymous action, necessarily — the user is locked out).

## 14. Notifications / External Effects
Sends one transactional email via `INT-EMAIL`.

## 15. Audit / Logging
Standard request logging; raw token and new password are never logged.

## 16. Acceptance Summary
A user can request a reset link and use it once, within its validity window, to set a new password.

## 17. Edge Cases
Requesting multiple reset emails in a row: each creates a new valid token; using any one of them invalidates the others implicitly is NOT guaranteed in v1 — each token is independently valid until used or expired (documented as a known limitation below).

## 18. Dependencies
`INT-EMAIL` must be configured.

## 19. Known Limitations
Multiple outstanding reset tokens for the same user are not mutually invalidated when one is used (each is checked independently); low risk since tokens are short-lived and single-use. Revisit if abuse is observed.

## 20. Open Questions
`OQ-005` (final email provider selection).
