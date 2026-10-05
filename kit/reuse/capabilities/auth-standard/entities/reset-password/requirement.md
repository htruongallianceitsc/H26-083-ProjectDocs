---
code: REQ-AUTH-RESET-PASSWORD-001
type: requirement
title: Reset Password requirement
status: approved
owner: Product & Engineering
created_at: 2026-10-05
updated_at: 2026-10-05
tags: []
related:
  modules: []
  features: [FEAT-AUTH-RESET-PASSWORD]
  requirements: []
  business_rules: []
  screens: []
  flows: []
  apis: []
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

# Reset Password requirement

## Requirement
The user can complete reset password when allowed by project policy.

## Acceptance criteria
1. Valid input follows the documented success flow.
2. Invalid input returns a privacy-safe error without leaking sensitive account state.
3. Security/audit controls defined by the project AUTH standard are applied.
4. Repeated requests are safe according to endpoint semantics and rate-limit policy.
