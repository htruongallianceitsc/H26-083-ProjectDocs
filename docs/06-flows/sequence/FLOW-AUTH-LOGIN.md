---
code: FLOW-AUTH-LOGIN
type: flow
title: Login Sequence
status: draft
owner: Backend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [auth, flow, sequence]
related:
  modules: [MOD-AUTH]
  features: [FEAT-AUTH-LOGIN]
  requirements: []
  business_rules: [BR-AUTH-002]
  screens: [SCR-LOGIN]
  flows: []
  apis: [API-AUTH-LOGIN]
  database_objects: [DB-USER, DB-REFRESH-TOKEN]
  tests: [TC-AUTH-LOGIN-001]
  decisions: [ADR-002]
---

# Flow

## Purpose
Show the full login sequence, including the account-lockout check and session issuance.

## Actors / Systems
User (browser), React SPA, Node.js API, PostgreSQL.

## Preconditions
User has a registered account and is not currently locked out.

## Flow Diagram

```mermaid
sequenceDiagram
  participant U as User
  participant SPA as React SPA
  participant API as Node.js API
  participant DB as PostgreSQL

  U->>SPA: Submit email + password
  SPA->>API: POST /api/auth/login
  API->>DB: Check failed-attempt count for email
  alt Locked out
    API-->>SPA: 423 ACCOUNT_LOCKED
    SPA-->>U: Show lockout message
  else Not locked out
    API->>DB: Look up user by email
    API->>API: Verify password hash
    alt Invalid credentials
      API->>DB: Increment failed-attempt count
      API-->>SPA: 401 INVALID_CREDENTIALS
      SPA-->>U: Show generic error
    else Valid credentials
      API->>DB: Reset failed-attempt count
      API->>DB: Insert refresh_tokens row
      API-->>SPA: 200 OK, accessToken + Set-Cookie refresh_token
      SPA->>SPA: Store accessToken in memory
      SPA-->>U: Redirect to last workspace
    end
  end
```

## Step Details

| Step | Actor/System | Action | Rule/API/Screen | Result |
|---|---|---|---|---|
| 1 | User | Submits credentials | SCR-LOGIN | Form submitted |
| 2 | API | Checks lockout state | BR-AUTH-002 | Proceed or reject |
| 3 | API | Verifies password | API-AUTH-LOGIN | Success/failure branch |
| 4 | API | Issues session | ADR-002, DB-REFRESH-TOKEN | Access token + refresh cookie |
| 5 | SPA | Redirects user | SCR-WORKSPACE-HOME | Authenticated session active |

## Error / Retry Paths
Invalid credentials and lockout are terminal for that request; the user retries the form. No automatic retry on the client for `401`/`423`.

## End States
Authenticated session established (success) or user remains on `SCR-LOGIN` with an inline error (failure).
