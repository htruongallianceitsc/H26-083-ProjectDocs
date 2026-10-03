---
code: SCR-LOGIN
type: screen
title: Login Screen
status: approved
owner: Web Team
route: /login
created_at: 2026-10-03
updated_at: 2026-10-03
last_reviewed_at: 2026-10-03
related:
  features: [FEAT-AUTH-LOGIN]
  apis: [API-AUTH-LOGIN]
  flows: [FLOW-AUTH-LOGIN]
---

# Login Screen

## Controls

| Control | Required | Notes |
|---|---:|---|
| Email | Yes | Email format validation |
| Password | Yes | Masked input |
| Login | Yes | Disabled while submitting |

## Screen states

```mermaid
stateDiagram-v2
  [*] --> Idle
  Idle --> Submitting: Submit
  Submitting --> Success: 200
  Submitting --> Error: 401/403/5xx
  Error --> Submitting: Retry
  Success --> [*]
```
