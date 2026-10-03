---
code: SCR-AUTH-LOGIN
type: screen
title: Login Screen
status: draft
owner: {{OWNER}}
created_at: {{IMPORT_DATE}}
updated_at: {{IMPORT_DATE}}
last_reviewed_at: {{IMPORT_DATE}}
route: {{AUTH_ROUTE_PREFIX}}/login
tags: [auth, reusable-capability]
related:
  features: [FEAT-AUTH-LOGIN]
  requirements: [REQ-AUTH-LOGIN-001]
  apis: [API-AUTH-LOGIN]
  tests: [TC-AUTH-LOGIN-001]
---

# Login Screen

## Purpose

Collect authentication credentials and present login errors without exposing sensitive account state.

## States

Initial, submitting, success redirect, invalid credential, account restricted and service unavailable states should be adapted to the selected project type.

## Accessibility

Identifier/password labels, error announcement, keyboard behavior and focus order must follow the applicable web/mobile standards.

## UI States

Initial, loading/submitting, success, invalid credentials, service error and disabled/account-restricted states.

## Offline

Authentication cannot complete without a reachable authentication service unless the project explicitly supports an offline-authentication mode. Show a non-destructive retry state and do not clear entered identifier unnecessarily.

## Permission

No native runtime permission is required for basic credential login. If biometric/password-manager/native credential capability is added by the project, document it as a separate native capability/permission contract.
