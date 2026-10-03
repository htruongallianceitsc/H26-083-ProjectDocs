---
code: BR-AUTH-001
type: business-rule
title: Disabled account cannot sign in
status: approved
owner: Product Team
created_at: 2026-10-03
updated_at: 2026-10-03
last_reviewed_at: 2026-10-03
related:
  features: [FEAT-AUTH-LOGIN]
  requirements: [REQ-AUTH-001]
  apis: [API-AUTH-LOGIN]
  tests: [TC-AUTH-LOGIN-002]
---

# Disabled account cannot sign in

Nếu `User.IsDisabled = true`, API login phải từ chối authentication dù password đúng.
