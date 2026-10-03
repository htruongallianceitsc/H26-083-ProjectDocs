---
code: FLOW-AUTH-LOGIN
type: flow
title: Login End-to-End Flow
status: approved
owner: Platform Team
created_at: 2026-10-03
updated_at: 2026-10-03
last_reviewed_at: 2026-10-03
related:
  features: [FEAT-AUTH-LOGIN]
  screens: [SCR-LOGIN]
  apis: [API-AUTH-LOGIN]
---

# Login End-to-End Flow

```mermaid
flowchart TD
  A[Open /login] --> B[Enter email + password]
  B --> C{Client validation valid?}
  C -- No --> D[Show validation errors]
  C -- Yes --> E[POST /api/auth/login]
  E --> F{Credential valid and account active?}
  F -- No --> G[Return generic auth error]
  F -- Yes --> H[Create token/session]
  H --> I[Redirect dashboard]
```
