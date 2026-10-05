---
code: API-BOARD-GET-DETAIL
type: api
title: Get Board Detail
status: draft
owner: Backend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [api, board]
method: GET
path: /api/boards/{boardId}
related:
  modules: [MOD-BOARD]
  features: [FEAT-BOARD-MANAGE]
  requirements: [REQ-BOARD-002]
  business_rules: []
  screens: [SCR-BOARD, SCR-BOARD-SETTINGS]
  flows: []
  apis: []
  database_objects: [DB-BOARD, DB-LIST, DB-CARD, DB-LABEL]
  tests: []
  decisions: []
---

# API Contract

## Purpose
Fetch a Board with its non-archived Lists and Cards nested, plus its label palette — the single primary read endpoint behind `SCR-BOARD`.

## Endpoint
- Method: `GET`
- Path: `/api/boards/{boardId}`
- Version: `v1`

## Authentication / Authorization
Bearer JWT required. Caller must be a member of the Board's Workspace.

## Request
### Headers
`Authorization: Bearer <token>`
### Path Parameters
`boardId` (uuid, required)
### Query Parameters
None (full nested load; no pagination in v1 given expected card counts)
### Body
None

## Response
### Success
`200 OK`
```json
{ "data": { "id": "uuid", "title": "Sprint 24", "background": "default-blue", "isStarred": false, "archivedAt": null, "labels": [ { "id": "uuid", "name": "Bug", "color": "red" } ], "lists": [ { "id": "uuid", "title": "To Do", "position": 1, "cards": [ { "id": "uuid", "title": "Fix login bug", "position": 1, "dueDate": null, "labelIds": ["uuid"], "memberIds": ["uuid"], "updatedAt": "2026-10-05T09:00:00Z" } ] } ] } }
```
### Errors
- `401 UNAUTHENTICATED`
- `403 FORBIDDEN` — not a workspace member
- `404 BOARD_NOT_FOUND`

## Validation
None.

## Business Rules Applied
None (read-only).

## Idempotency / Concurrency
Read-only, naturally idempotent.

## Transaction Boundary
Single read transaction across `DB-BOARD`, `DB-LIST` (`archived_at IS NULL`), `DB-CARD` (`archived_at IS NULL`), `DB-LABEL`.

## Database Impact
### READ
`DB-BOARD`, `DB-LIST`, `DB-CARD`, `DB-LABEL`, `DB-CARD-LABEL`, `DB-CARD-MEMBER`
### WRITE
None

## External Dependencies
None.

## Logging / Audit
Standard request logging.

## Performance / Rate Limit
The highest-traffic read endpoint in the system; indexed per `docs/08-database/tables/DB-LIST.md`/`DB-CARD.md` (`board_id`/`list_id` + `position`). See `NFR-PERF-001`.

## Related Feature / Screen / Tests
`FEAT-BOARD-MANAGE`, `SCR-BOARD`, `SCR-BOARD-SETTINGS`
