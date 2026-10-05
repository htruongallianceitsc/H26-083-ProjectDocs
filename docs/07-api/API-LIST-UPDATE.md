---
code: API-LIST-UPDATE
type: api
title: Update / Archive List
status: draft
owner: Backend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [api, list]
method: PATCH
path: /api/lists/{listId}
related:
  modules: [MOD-LIST]
  features: [FEAT-LIST-MANAGE]
  requirements: [REQ-LIST-001]
  business_rules: [BR-LIST-001, BR-BOARD-002]
  screens: [SCR-BOARD]
  flows: []
  apis: []
  database_objects: [DB-LIST]
  tests: [TC-LIST-MANAGE-001]
  decisions: []
---

# API Contract

## Purpose
Rename a List and/or archive/unarchive it.

## Endpoint
- Method: `PATCH`
- Path: `/api/lists/{listId}`
- Version: `v1`

## Authentication / Authorization
Bearer JWT required. Caller must be a member of the List's Board's Workspace.

## Request
### Headers
`Authorization: Bearer <token>`, `Content-Type: application/json`
### Path Parameters
`listId` (uuid, required)
### Query Parameters
None
### Body
```json
{ "title": "Backlog (Q4)", "archivedAt": null }
```
Both fields optional; `archivedAt` set to an ISO timestamp archives it, `null` unarchives it.

## Response
### Success
`200 OK`
```json
{ "data": { "id": "uuid", "title": "Backlog (Q4)", "archivedAt": null, "updatedAt": "2026-10-05T09:20:00Z" } }
```
### Errors
- `400 VALIDATION_ERROR`
- `401 UNAUTHENTICATED`
- `403 FORBIDDEN`
- `404 LIST_NOT_FOUND`
- `409 BOARD_ARCHIVED` (`BR-BOARD-002`)

## Validation
`title`: 1-60 chars if present.

## Business Rules Applied
`BR-LIST-001`, `BR-BOARD-002`

## Idempotency / Concurrency
Idempotent: reapplying the same body yields the same state.

## Transaction Boundary
Single-row update.

## Database Impact
### READ
`DB-LIST` (existence/authorization), `DB-BOARD` (archived check)
### WRITE
`DB-LIST` (update)

## External Dependencies
None.

## Logging / Audit
Standard request logging.

## Performance / Rate Limit
Standard write-endpoint rate limit. Broadcasts `list.updated`/`list.archived` over the board's WebSocket channel.

## Related Feature / Screen / Tests
`FEAT-LIST-MANAGE`, `SCR-BOARD`, `TC-LIST-MANAGE-001`
