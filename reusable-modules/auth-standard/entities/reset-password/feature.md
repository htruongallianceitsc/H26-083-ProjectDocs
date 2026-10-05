---
code: FEAT-AUTH-RESET-PASSWORD
type: feature
title: Reset Password
status: planned
owner: Product & Engineering
created_at: 2026-10-05
updated_at: 2026-10-05
tags: [auth]
related:
  modules: [MOD-AUTH]
  features: []
  requirements: [REQ-AUTH-RESET-PASSWORD-001]
  business_rules: []
  screens: [SCR-AUTH-RESET-PASSWORD]
  flows: []
  apis: [API-AUTH-RESET-PASSWORD]
  database_objects: []
  tests: [TC-AUTH-RESET-PASSWORD-001]
  decisions: []
  integrations: []
  nfrs: []
  runbooks: []
  permissions: []
  deep_links: []
  sync_policies: []
---

# Reset Password

## Goal
Provide reset password according to the project authentication policy.

## Variables
- Route prefix: `{{AUTH_ROUTE_PREFIX}}`
- API prefix: `{{AUTH_API_PREFIX}}`
- Login identifier: `{{LOGIN_IDENTIFIER}}`
- Session strategy: `{{SESSION_STRATEGY}}`

## Required behavior
Define success, validation failure, authorization/session failure, audit behavior, security controls and recovery/edge cases. Project-specific values remain governed by the imported Open Question/ADRs.
