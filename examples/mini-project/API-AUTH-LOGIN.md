---
code: API-AUTH-LOGIN
type: api
title: Login API
status: approved
owner: API Team
method: POST
path: /api/auth/login
created_at: 2026-10-03
updated_at: 2026-10-03
last_reviewed_at: 2026-10-03
related:
  features: [FEAT-AUTH-LOGIN]
  requirements: [REQ-AUTH-001]
  business_rules: [BR-AUTH-001]
  screens: [SCR-LOGIN]
  database_objects: [DB-USER]
---

# Login API

## Request

```json
{
  "email": "user@example.com",
  "password": "********"
}
```

## Response

```json
{
  "accessToken": "<token>",
  "expiresIn": 3600
}
```

## Sequence

```mermaid
sequenceDiagram
  actor U as User
  participant W as Web
  participant A as Auth API
  participant D as Database
  U->>W: Submit credentials
  W->>A: POST /api/auth/login
  A->>D: Find active user
  D-->>A: User + password hash
  A->>A: Verify password
  alt valid
    A-->>W: 200 + access token
    W-->>U: Dashboard
  else invalid
    A-->>W: 401 generic error
    W-->>U: Show error
  end
```
