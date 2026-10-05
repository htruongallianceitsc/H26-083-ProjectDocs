---
code: API-BOARD-UPDATE
type: api
title: Update Board
status: draft
owner: Backend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [api, board]
method: PATCH
path: /api/boards/{boardId}
related:
  modules: [MOD-BOARD]
  features: [FEAT-BOARD-MANAGE]
  requirements: [REQ-BOARD-002]
  business_rules: [BR-BOARD-001]
  screens: [SCR-BOARD-SETTINGS]
  flows: []
  apis: []
  database_objects: [DB-BOARD]
  tests: [TC-BOARD-MANAGE-001]
  decisions: []
---

# API Contract

## Purpose
Update a Board's title/background/visibility/star state, and unarchive it.

## Endpoint
- Method: `PATCH`
- Path: `/api/boards/{boardId}`
- Version: `v1`

## Authentication / Authorization
Bearer JWT required. Caller must be the Board's creator or the Workspace's `owner`/`admin`.

## Request
### Headers
`Authorization: Bearer <token>`, `Content-Type: application/json`
### Path Parameters
`boardId` (uuid, required)
### Query Parameters
None
### Body
```json
{ "title": "Sprint 25", "background": "default-green", "visibility": "workspace", "isStarred": true, "archivedAt": null }
```
All fields optional; `archivedAt: null` is how a board is unarchived through this endpoint.

## Response
### Success
`200 OK`
```json
{ "data": { "id": "uuid", "title": "Sprint 25", "background": "default-green", "visibility": "workspace", "isStarred": true, "archivedAt": null, "updatedAt": "2026-10-05T09:10:00Z" } }
```
### Errors
- `400 VALIDATION_ERROR`
- `401 UNAUTHENTICATED`
- `403 FORBIDDEN`
- `404 BOARD_NOT_FOUND`

## Validation
`title`: 1-100 chars if present. `visibility`: `workspace`/`private` if present.

## Business Rules Applied
Authorization per `FEAT-BOARD-MANAGE` (creator or workspace owner/admin).

## Idempotency / Concurrency
Idempotent: reapplying the same body yields the same state.

## Transaction Boundary
Single-row update.

## Database Impact
### READ
`DB-BOARD` (existence/authorization)
### WRITE
`DB-BOARD` (update)

## External Dependencies
None.

## Logging / Audit
Standard request logging.

## Performance / Rate Limit
Standard write-endpoint rate limit.

## Related Feature / Screen / Tests
`FEAT-BOARD-MANAGE`, `SCR-BOARD-SETTINGS`, `TC-BOARD-MANAGE-001`
