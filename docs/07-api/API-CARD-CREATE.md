---
code: API-CARD-CREATE
type: api
title: Create Card
status: draft
owner: Backend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [api, card]
method: POST
path: /api/lists/{listId}/cards
related:
  modules: [MOD-CARD]
  features: [FEAT-CARD-CREATE]
  requirements: [REQ-CARD-001]
  business_rules: [BR-LIST-001, BR-BOARD-002]
  screens: [SCR-BOARD]
  flows: [FLOW-CARD-LIFECYCLE]
  apis: []
  database_objects: [DB-CARD, DB-ACTIVITY-LOG]
  tests: [TC-CARD-CREATE-001]
  decisions: []
---

# API Contract

## Purpose
Create a new Card at the end of a List.

## Endpoint
- Method: `POST`
- Path: `/api/lists/{listId}/cards`
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
{ "title": "Fix login bug" }
```

## Response
### Success
`201 Created`
```json
{ "data": { "id": "uuid", "listId": "uuid", "boardId": "uuid", "title": "Fix login bug", "position": 5.0, "createdAt": "2026-10-05T09:00:00Z", "updatedAt": "2026-10-05T09:00:00Z" } }
```
### Errors
- `400 VALIDATION_ERROR`
- `401 UNAUTHENTICATED`
- `403 FORBIDDEN`
- `404 LIST_NOT_FOUND`
- `409 LIST_ARCHIVED` (`BR-LIST-001`)
- `409 BOARD_ARCHIVED` (`BR-BOARD-002`)

## Validation
`title`: required, 1-200 chars.

## Business Rules Applied
`BR-LIST-001`, `BR-BOARD-002`

## Idempotency / Concurrency
Not idempotent (creates a new resource each call).

## Transaction Boundary
Insert `DB-CARD` row and one `DB-ACTIVITY-LOG` row (`action_type = card_created`), in one transaction.

## Database Impact
### READ
`DB-LIST` (existence/archived), `DB-BOARD` (archived), `DB-CARD` (max position in list)
### WRITE
`DB-CARD` (insert), `DB-ACTIVITY-LOG` (insert)

## External Dependencies
None.

## Logging / Audit
Recorded in `DB-ACTIVITY-LOG`.

## Performance / Rate Limit
Standard write-endpoint rate limit. Broadcasts `card.created` over the board's WebSocket channel.

## Related Feature / Screen / Tests
`FEAT-CARD-CREATE`, `SCR-BOARD`, `TC-CARD-CREATE-001`
