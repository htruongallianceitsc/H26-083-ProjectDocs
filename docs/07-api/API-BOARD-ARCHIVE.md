---
code: API-BOARD-ARCHIVE
type: api
title: Archive Board
status: draft
owner: Backend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [api, board]
method: POST
path: /api/boards/{boardId}/archive
related:
  modules: [MOD-BOARD]
  features: [FEAT-BOARD-MANAGE]
  requirements: [REQ-BOARD-002]
  business_rules: [BR-BOARD-002]
  screens: [SCR-BOARD-SETTINGS]
  flows: []
  apis: []
  database_objects: [DB-BOARD]
  tests: [TC-BOARD-MANAGE-001]
  decisions: [ADR-005]
---

# API Contract

## Purpose
Soft-delete (archive) a Board, making it and its contents read-only and hiding it from the default board list.

## Endpoint
- Method: `POST`
- Path: `/api/boards/{boardId}/archive`
- Version: `v1`

## Authentication / Authorization
Bearer JWT required. Caller must be the Board's creator or the Workspace's `owner`/`admin`.

## Request
### Headers
`Authorization: Bearer <token>`
### Path Parameters
`boardId` (uuid, required)
### Query Parameters
None
### Body
None

## Response
### Success
`200 OK`
```json
{ "data": { "id": "uuid", "archivedAt": "2026-10-05T09:15:00Z" } }
```
### Errors
- `401 UNAUTHENTICATED`
- `403 FORBIDDEN`
- `404 BOARD_NOT_FOUND`
- `409 ALREADY_ARCHIVED`

## Validation
None beyond existence/authorization.

## Business Rules Applied
`BR-BOARD-002` (effect of this action).

## Idempotency / Concurrency
Not idempotent in the strict sense (second call returns `409 ALREADY_ARCHIVED`), but safe to retry — client treats that as success.

## Transaction Boundary
Single-row update (`archived_at`).

## Database Impact
### READ
`DB-BOARD` (existence/authorization)
### WRITE
`DB-BOARD` (`archived_at`)

## External Dependencies
None.

## Logging / Audit
Standard request logging.

## Performance / Rate Limit
Standard write-endpoint rate limit.

## Related Feature / Screen / Tests
`FEAT-BOARD-MANAGE`, `SCR-BOARD-SETTINGS`, `TC-BOARD-MANAGE-001`
