---
code: TC-AUTH-LOGIN-002
type: test-case
title: Disabled account cannot login
status: passed
owner: QA Team
created_at: 2026-10-03
updated_at: 2026-10-03
last_reviewed_at: 2026-10-03
related:
  features: [FEAT-AUTH-LOGIN]
  requirements: [REQ-AUTH-001]
  business_rules: [BR-AUTH-001]
  apis: [API-AUTH-LOGIN]
---

# Disabled account cannot login

1. Prepare an account with `IsDisabled = true`.
2. Enter correct credential.
3. Submit.
4. Verify API rejects login and UI shows a generic authentication error.
