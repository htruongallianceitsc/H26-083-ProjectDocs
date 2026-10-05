---
code: API-BOARD-CREATE
type: api
title: Create Board
status: draft
owner: Backend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [api, board]
method: POST
path: /api/workspaces/{workspaceId}/boards
related:
  modules: [MOD-BOARD]
  features: [FEAT-BOARD-CREATE]
  requirements: [REQ-BOARD-001]
  business_rules: [BR-BOARD-001]
  screens: [SCR-WORKSPACE-HOME]
  flows: []
  apis: []
  database_objects: [DB-BOARD, DB-LIST]
  tests: [TC-BOARD-CREATE-001]
  decisions: []
---

# API Contract

## Purpose
Create a new Board in a Workspace, seeded with 3 default Lists.

## Endpoint
- Method: `POST`
- Path: `/api/workspaces/{workspaceId}/boards`
- Version: `v1`

## Authentication / Authorization
Bearer JWT required. Caller must be a member of `workspaceId` (`BR-BOARD-001`).

## Request
### Headers
`Authorization: Bearer <token>`, `Content-Type: application/json`
### Path Parameters
`workspaceId` (uuid, required)
### Query Parameters
None
### Body
```json
{ "title": "Sprint 24", "background": "default-blue" }
```
`background` optional, defaults to `default-blue`.

## Response
### Success
`201 Created`
```json
{ "data": { "id": "uuid", "workspaceId": "uuid", "title": "Sprint 24", "background": "default-blue", "lists": [ { "id": "uuid", "title": "To Do", "position": 1 }, { "id": "uuid", "title": "In Progress", "position": 2 }, { "id": "uuid", "title": "Done", "position": 3 } ] } }
```
### Errors
- `400 VALIDATION_ERROR`
- `401 UNAUTHENTICATED`
- `403 FORBIDDEN` (`BR-BOARD-001`)
- `404 WORKSPACE_NOT_FOUND`

## Validation
`title`: required, 1-100 chars.

## Business Rules Applied
`BR-BOARD-001`

## Idempotency / Concurrency
Not idempotent (creates a new resource each call).

## Transaction Boundary
Insert `DB-BOARD` row and 3 `DB-LIST` rows in one transaction.

## Database Impact
### READ
`DB-WORKSPACE-MEMBER` (authorization)
### WRITE
`DB-BOARD` (insert), `DB-LIST` (3 inserts)

## External Dependencies
None.

## Logging / Audit
Standard request logging.

## Performance / Rate Limit
Standard write-endpoint rate limit.

## Related Feature / Screen / Tests
`FEAT-BOARD-CREATE`, `SCR-WORKSPACE-HOME`, `TC-BOARD-CREATE-001`
