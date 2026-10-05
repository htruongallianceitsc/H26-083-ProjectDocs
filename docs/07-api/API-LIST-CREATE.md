---
code: API-LIST-CREATE
type: api
title: Create List
status: draft
owner: Backend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [api, list]
method: POST
path: /api/boards/{boardId}/lists
related:
  modules: [MOD-LIST]
  features: [FEAT-LIST-MANAGE]
  requirements: [REQ-LIST-001]
  business_rules: [BR-BOARD-002]
  screens: [SCR-BOARD]
  flows: []
  apis: []
  database_objects: [DB-LIST]
  tests: [TC-LIST-MANAGE-001]
  decisions: [ADR-003]
---

# API Contract

## Purpose
Create a new List at the end of a Board.

## Endpoint
- Method: `POST`
- Path: `/api/boards/{boardId}/lists`
- Version: `v1`

## Authentication / Authorization
Bearer JWT required. Caller must be a member of the Board's Workspace.

## Request
### Headers
`Authorization: Bearer <token>`, `Content-Type: application/json`
### Path Parameters
`boardId` (uuid, required)
### Query Parameters
None
### Body
```json
{ "title": "Backlog" }
```

## Response
### Success
`201 Created`
```json
{ "data": { "id": "uuid", "boardId": "uuid", "title": "Backlog", "position": 4.0 } }
```
### Errors
- `400 VALIDATION_ERROR`
- `401 UNAUTHENTICATED`
- `403 FORBIDDEN`
- `404 BOARD_NOT_FOUND`
- `409 BOARD_ARCHIVED` (`BR-BOARD-002`)

## Validation
`title`: required, 1-60 chars.

## Business Rules Applied
`BR-BOARD-002`

## Idempotency / Concurrency
Not idempotent (creates a new resource). New position is computed as `max(existing positions) + 1`, so concurrent creates may need a retry-safe recompute if they race; acceptable at MVP scale.

## Transaction Boundary
Single-row insert.

## Database Impact
### READ
`DB-BOARD` (existence/archived check), `DB-LIST` (max position)
### WRITE
`DB-LIST` (insert)

## External Dependencies
None.

## Logging / Audit
Standard request logging.

## Performance / Rate Limit
Standard write-endpoint rate limit. Broadcasts `list.created` over the board's WebSocket channel.

## Related Feature / Screen / Tests
`FEAT-LIST-MANAGE`, `SCR-BOARD`, `TC-LIST-MANAGE-001`
