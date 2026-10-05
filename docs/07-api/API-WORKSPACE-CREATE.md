---
code: API-WORKSPACE-CREATE
type: api
title: Create Workspace
status: draft
owner: Backend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [api, workspace]
method: POST
path: /api/workspaces
related:
  modules: [MOD-WORKSPACE]
  features: [FEAT-WORKSPACE-CREATE]
  requirements: [REQ-WORKSPACE-001]
  business_rules: []
  screens: [SCR-WORKSPACE-HOME]
  flows: []
  apis: []
  database_objects: [DB-WORKSPACE, DB-WORKSPACE-MEMBER]
  tests: [TC-WORKSPACE-CREATE-001]
  decisions: []
---

# API Contract

## Purpose
Create a new Workspace and make the caller its owner.

## Endpoint
- Method: `POST`
- Path: `/api/workspaces`
- Version: `v1`

## Authentication / Authorization
Bearer JWT required. Any authenticated user may call this.

## Request
### Headers
`Authorization: Bearer <token>`, `Content-Type: application/json`
### Path Parameters
None
### Query Parameters
None
### Body
```json
{ "name": "Acme Team" }
```

## Response
### Success
`201 Created`
```json
{ "data": { "id": "uuid", "name": "Acme Team", "createdBy": "uuid", "createdAt": "2026-10-05T09:00:00Z" } }
```
### Errors
- `400 VALIDATION_ERROR`
- `401 UNAUTHENTICATED`

## Validation
`name`: required, 1-100 chars.

## Business Rules Applied
None specific.

## Idempotency / Concurrency
Not idempotent (creates a new resource each call).

## Transaction Boundary
Insert `DB-WORKSPACE` row and insert the creator as `owner` into `DB-WORKSPACE-MEMBER`, in one transaction.

## Database Impact
### READ
None
### WRITE
`DB-WORKSPACE` (insert), `DB-WORKSPACE-MEMBER` (insert)

## External Dependencies
None.

## Logging / Audit
Standard request logging.

## Performance / Rate Limit
Standard write-endpoint rate limit.

## Related Feature / Screen / Tests
`FEAT-WORKSPACE-CREATE`, `SCR-WORKSPACE-HOME`, `TC-WORKSPACE-CREATE-001`
