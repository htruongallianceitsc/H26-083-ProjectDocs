---
code: TC-AUTH-LOGIN-001
type: test-case
title: Login primary test
status: ready
owner: Product & Engineering
created_at: 2026-10-05
updated_at: 2026-10-05
tags: []
related:
  modules: []
  features: [FEAT-AUTH-LOGIN]
  requirements: [REQ-AUTH-LOGIN-001]
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

# Login primary test

## Preconditions
Use an account/test fixture appropriate to login.

## Test
1. Execute the canonical success path.
2. Verify expected UI/API state and audit outcome.
3. Verify at least one invalid/security-sensitive path.
4. Verify retry/duplicate behavior where applicable.

## Expected
Behavior matches `REQ-AUTH-LOGIN-001` without sensitive information leakage.
