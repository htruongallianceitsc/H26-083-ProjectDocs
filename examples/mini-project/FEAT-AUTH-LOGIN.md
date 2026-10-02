---
code: FEAT-AUTH-LOGIN
type: feature
title: Login
status: approved
owner: Platform Team
related:
  module: MOD-AUTH
  requirements: [REQ-AUTH-001]
  business_rules: [BR-AUTH-001]
  screens: [SCR-LOGIN]
  apis: [API-AUTH-LOGIN]
  tests: [TC-AUTH-LOGIN-001, TC-AUTH-LOGIN-002]
---
# Login

## Goal
Cho phép người dùng có tài khoản hợp lệ đăng nhập vào hệ thống.

## Actor
Registered User.

## Main Flow
1. User mở `SCR-LOGIN`.
2. Nhập email và password.
3. Screen gọi `API-AUTH-LOGIN`.
4. Nếu credential hợp lệ, tạo session/token và chuyển vào dashboard.

## Error Flow
Credential sai -> API trả authentication error; UI không tiết lộ email có tồn tại hay không.
