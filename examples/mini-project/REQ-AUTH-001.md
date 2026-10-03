---
code: REQ-AUTH-001
type: requirement
title: Authenticate registered user
status: approved
owner: Product Team
created_at: 2026-10-03
updated_at: 2026-10-03
last_reviewed_at: 2026-10-03
related:
  features: [FEAT-AUTH-LOGIN]
  business_rules: [BR-AUTH-001]
  tests: [TC-AUTH-LOGIN-001, TC-AUTH-LOGIN-002]
---

# Authenticate registered user

Hệ thống phải cho phép tài khoản active đăng nhập bằng thông tin hợp lệ và từ chối thông tin không hợp lệ.

## Acceptance criteria

- Given account active, when credential đúng, then login thành công.
- Given credential sai, then login bị từ chối bằng generic error.
