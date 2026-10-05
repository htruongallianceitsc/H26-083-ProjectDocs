---
code: API-AUTH-FORGOT-PASSWORD
type: api
title: Forgot Password API
status: approved
owner: Product & Engineering
created_at: 2026-10-05
updated_at: 2026-10-05
tags: []
related:
  modules: []
  features: [FEAT-AUTH-FORGOT-PASSWORD]
  requirements: [REQ-AUTH-FORGOT-PASSWORD-001]
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
  deep_links: []
  sync_policies: []
---

# Forgot Password API

## Contract
`POST {{AUTH_API_PREFIX}}/forgot-password`

## Authentication
Document whether anonymous, authenticated or recovery-token access is required.

## Validation & errors
Use project API conventions, privacy-safe auth errors, rate limits and correlation IDs.

## Security
Apply brute-force/replay/idempotency controls as applicable to this operation.
