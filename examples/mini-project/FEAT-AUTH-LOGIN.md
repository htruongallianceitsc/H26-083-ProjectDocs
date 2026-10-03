---
code: FEAT-AUTH-LOGIN
type: feature
title: User Login
status: approved
owner: Platform Team
created_at: 2026-10-03
updated_at: 2026-10-03
last_reviewed_at: 2026-10-03
tags: [auth, login]
related:
  modules: [MOD-AUTH]
  requirements: [REQ-AUTH-001]
  business_rules: [BR-AUTH-001]
  screens: [SCR-LOGIN]
  flows: [FLOW-AUTH-LOGIN]
  apis: [API-AUTH-LOGIN]
  database_objects: [DB-USER]
  tests: [TC-AUTH-LOGIN-001, TC-AUTH-LOGIN-002]
---

# User Login

## Goal

Cho phép người dùng hợp lệ đăng nhập bằng email và mật khẩu.

## Main flow

1. User mở `/login`.
2. Nhập email và password.
3. UI gọi `POST /api/auth/login`.
4. Backend xác thực user.
5. Thành công: trả session/token và điều hướng Dashboard.
6. Thất bại: hiển thị lỗi chung, không tiết lộ email có tồn tại hay không.

## Acceptance summary

- Valid credential đăng nhập thành công.
- Invalid credential trả lỗi thống nhất.
- Disabled account không được đăng nhập.
