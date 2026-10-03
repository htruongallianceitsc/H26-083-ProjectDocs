---
code: DB-USER
type: database-object
title: User Table
status: approved
owner: Data Team
object_name: User
object_type: table
created_at: 2026-10-03
updated_at: 2026-10-03
last_reviewed_at: 2026-10-03
related:
  features: [FEAT-AUTH-LOGIN]
  apis: [API-AUTH-LOGIN]
---

# User Table

## Logical model

```mermaid
erDiagram
  USER {
    bigint Id PK
    varchar Email UK
    varchar PasswordHash
    boolean IsDisabled
    timestamptz CreatedAt
  }
  USER ||--o{ SESSION : creates
  SESSION {
    bigint Id PK
    bigint UserId FK
    varchar TokenHash
    timestamptz ExpiresAt
  }
```
