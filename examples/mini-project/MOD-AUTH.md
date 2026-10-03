---
code: MOD-AUTH
type: module
title: Authentication
status: approved
owner: Platform Team
created_at: 2026-10-03
updated_at: 2026-10-03
last_reviewed_at: 2026-10-03
tags: [auth, security]
related:
  features: [FEAT-AUTH-LOGIN]
---

# Authentication Module

Quản lý đăng nhập và session của người dùng.

## Feature map

```mermaid
flowchart LR
  U[User] --> L[Login Screen]
  L --> A[POST /api/auth/login]
  A --> D[(User)]
  A --> S[Session created]
```
