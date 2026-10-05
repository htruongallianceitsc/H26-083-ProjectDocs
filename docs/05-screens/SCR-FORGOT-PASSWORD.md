---
code: SCR-FORGOT-PASSWORD
type: screen
title: Forgot / Reset Password
status: draft
owner: Frontend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [auth, screen]
route: /forgot-password
related:
  modules: [MOD-AUTH]
  features: [FEAT-AUTH-FORGOT-PASSWORD]
  requirements: []
  business_rules: [BR-AUTH-001]
  screens: []
  flows: []
  apis: [API-AUTH-FORGOT-PASSWORD, API-AUTH-RESET-PASSWORD]
  database_objects: []
  tests: [TC-AUTH-FORGOT-PASSWORD-001]
  decisions: []
---

# Screen / Route

## Purpose
Let a user request a password reset link and, via the emailed link, set a new password.

## Route
`/forgot-password` (request mode) and `/forgot-password?token=<token>` (reset mode)

## Accessible Roles
Anonymous.

## Entry Points
"Forgot password?" link on `SCR-LOGIN`; the emailed reset link.

## Layout / Sections
**Request mode**: email field, submit button. **Reset mode** (token present in URL): new password field, confirm password field, submit button.

## Fields

| Field | Type | Required | Validation | Notes |
|---|---|---:|---|---|
| email | text | Yes (request mode) | valid email format | |
| newPassword | password | Yes (reset mode) | min 8 chars, 1 letter + 1 digit (`BR-AUTH-001`) | |
| confirmPassword | password | Yes (reset mode) | must match newPassword | client-side only |

## Actions
Submit reset request (request mode); submit new password (reset mode).

## Data Sources
`API-AUTH-FORGOT-PASSWORD` (request mode), `API-AUTH-RESET-PASSWORD` (reset mode)

## UI States
- Initial
- Loading
- Success (request mode: "check your email" message; reset mode: redirect to `/login` with a success toast)
- Error (reset mode: expired/used token message with a "request a new link" action)
- Empty — n/a
- No Permission — n/a

## Navigation Rules
Request mode always shows the generic success message regardless of whether the email matched an account (anti-enumeration, see `FEAT-AUTH-FORGOT-PASSWORD`).

## Validation & Messages
Reset mode checks password match client-side before submit; server is authoritative for policy and token validity.

## Responsive / Accessibility
Single-column form, usable down to tablet width.

## Related Features / Rules / APIs
`FEAT-AUTH-FORGOT-PASSWORD`, `BR-AUTH-001`, `API-AUTH-FORGOT-PASSWORD`, `API-AUTH-RESET-PASSWORD`
