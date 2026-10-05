---
code: API-LABEL-ASSIGN
type: api
title: Assign Label to Card
status: draft
owner: Backend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [api, label, card]
method: POST
path: /api/cards/{cardId}/labels/{labelId}
related:
  modules: [MOD-LABEL]
  features: [FEAT-LABEL-ASSIGN]
  requirements: [REQ-LABEL-002]
  business_rules: []
  screens: [SCR-CARD-DETAIL]
  flows: []
  apis: []
  database_objects: [DB-CARD-LABEL]
  tests: [TC-LABEL-ASSIGN-001]
  decisions: []
---

# API Contract

## Purpose
Assign an existing board label to a card.

## Endpoint
- Method: `POST`
- Path: `/api/cards/{cardId}/labels/{labelId}`
- Version: `v1`

## Authentication / Authorization
Bearer JWT required. Caller must be a member of the Card's Board's Workspace.

## Request
### Headers
`Authorization: Bearer <token>`
### Path Parameters
`cardId` (uuid, required), `labelId` (uuid, required)
### Query Parameters
None
### Body
None

## Response
### Success
`201 Created`
```json
{ "data": { "cardId": "uuid", "labelId": "uuid" } }
```
If already assigned, returns `200 OK` with the same body (idempotent).
### Errors
- `401 UNAUTHENTICATED`
- `403 FORBIDDEN` — not a workspace member
- `404 CARD_NOT_FOUND` / `404 LABEL_NOT_FOUND`
- `409 CARD_ARCHIVED` (`BR-CARD-003`)
- `422 LABEL_BOARD_MISMATCH` — label does not belong to the card's board

## Validation
`labelId` must belong to the same board as `cardId`.

## Business Rules Applied
`BR-CARD-003` (archived cards cannot be modified).

## Idempotency / Concurrency
Idempotent: assigning an already-assigned label is a no-op success.

## Transaction Boundary
Insert into `DB-CARD-LABEL` plus one `DB-ACTIVITY-LOG` insert (`action_type = label_assigned`), in one transaction.

## Database Impact
### READ
`DB-CARD`, `DB-LABEL` (existence/board-match check)
### WRITE
`DB-CARD-LABEL` (insert), `DB-ACTIVITY-LOG` (insert)

## External Dependencies
None.

## Logging / Audit
Recorded in `DB-ACTIVITY-LOG`.

## Performance / Rate Limit
Standard write-endpoint rate limit. Broadcasts `card.label_assigned` over the board's WebSocket channel (`docs/07-api/conventions.md`).

## Related Feature / Screen / Tests
`FEAT-LABEL-ASSIGN`, `SCR-CARD-DETAIL`, `TC-LABEL-ASSIGN-001`
