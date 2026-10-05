---
code: API-LABEL-CREATE
type: api
title: Create Board Label
status: draft
owner: Backend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [api, label]
method: POST
path: /api/boards/{boardId}/labels
related:
  modules: [MOD-LABEL]
  features: [FEAT-LABEL-MANAGE]
  requirements: [REQ-LABEL-001]
  business_rules: [BR-LABEL-001]
  screens: [SCR-BOARD-SETTINGS]
  flows: []
  apis: []
  database_objects: [DB-LABEL]
  tests: [TC-LABEL-MANAGE-001]
  decisions: []
---

# API Contract

## Purpose
Create a new label scoped to a Board.

## Endpoint
- Method: `POST`
- Path: `/api/boards/{boardId}/labels`
- Version: `v1`

## Authentication / Authorization
Bearer JWT required. Caller must be the Board's Workspace `owner`/`admin`, or the Board's creator.

## Request
### Headers
`Authorization: Bearer <token>`, `Content-Type: application/json`
### Path Parameters
`boardId` (uuid, required)
### Query Parameters
None
### Body
```json
{ "name": "Bug", "color": "red" }
```

## Response
### Success
`201 Created`
```json
{ "data": { "id": "uuid", "boardId": "uuid", "name": "Bug", "color": "red", "createdAt": "2026-10-05T09:00:00Z" } }
```
### Errors
- `400 VALIDATION_ERROR` — name empty or > 40 chars, or invalid color token.
- `401 UNAUTHENTICATED`
- `403 FORBIDDEN` — caller lacks owner/admin/creator permission.
- `404 BOARD_NOT_FOUND`
- `409 LABEL_NAME_DUPLICATE` (`BR-LABEL-001`)
- `409 LABEL_LIMIT_REACHED` (`BR-LABEL-001`)

## Validation
`name`: required, 1-40 chars, trimmed. `color`: required, must be one of the supported color tokens (e.g. `red, orange, yellow, green, blue, purple, gray`).

## Business Rules Applied
`BR-LABEL-001`

## Idempotency / Concurrency
Not idempotent by design (each call creates a new label); the `UNIQUE (board_id, name)` constraint prevents duplicate concurrent creation with the same name.

## Transaction Boundary
Single-row insert; no multi-table transaction needed.

## Database Impact
### READ
`DB-BOARD` (existence/authorization check)
### WRITE
`DB-LABEL` (insert)

## External Dependencies
None.

## Logging / Audit
Standard request logging; not written to `activity_log` (board-level, not card-level event).

## Performance / Rate Limit
Standard write-endpoint rate limit (see `docs/07-api/conventions.md`).

## Related Feature / Screen / Tests
`FEAT-LABEL-MANAGE`, `SCR-BOARD-SETTINGS`, `TC-LABEL-MANAGE-001`
