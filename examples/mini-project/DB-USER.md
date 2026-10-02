---
code: DB-USER
type: database_object
title: User table
status: approved
---
# User

## Purpose
Stores user identity and account status.

## Key Fields
- Id
- Email (unique)
- PasswordHash
- IsDisabled
- CreatedAt
- UpdatedAt

## Read By
- `API-AUTH-LOGIN`
