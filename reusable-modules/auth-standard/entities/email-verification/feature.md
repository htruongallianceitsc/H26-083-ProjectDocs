---
code: FEAT-AUTH-EMAIL-VERIFICATION
type: feature
title: Email Verification
status: planned
owner: Product & Engineering
created_at: 2026-10-05
updated_at: 2026-10-05
tags: [auth]
related:
  modules: [MOD-AUTH]
  features: []
  requirements: [REQ-AUTH-EMAIL-VERIFICATION-001]
  business_rules: []
  screens: [SCR-AUTH-EMAIL-VERIFICATION]
  flows: []
  apis: [API-AUTH-EMAIL-VERIFICATION]
  database_objects: []
  tests: [TC-AUTH-EMAIL-VERIFICATION-001]
  decisions: []
  integrations: []
  nfrs: []
  runbooks: []
  permissions: []
  deep_links: []
  sync_policies: []
---

# Email Verification

## Goal
Provide email verification according to the project authentication policy.

## Variables
- Route prefix: `{{AUTH_ROUTE_PREFIX}}`
- API prefix: `{{AUTH_API_PREFIX}}`
- Login identifier: `{{LOGIN_IDENTIFIER}}`
- Session strategy: `{{SESSION_STRATEGY}}`

## Required behavior
Define success, validation failure, authorization/session failure, audit behavior, security controls and recovery/edge cases. Project-specific values remain governed by the imported Open Question/ADRs.
