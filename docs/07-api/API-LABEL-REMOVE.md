---
code: API-LABEL-REMOVE
type: api
title: Remove Label from Card
status: draft
owner: Backend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [api, label, card]
method: DELETE
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
Remove a label assignment from a card.

## Endpoint
- Method: `DELETE`
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
`204 No Content`
### Errors
- `401 UNAUTHENTICATED`
- `403 FORBIDDEN`
- `404 CARD_NOT_FOUND`
- `409 CARD_ARCHIVED` (`BR-CARD-003`)

## Validation
None beyond existence/authorization.

## Business Rules Applied
`BR-CARD-003`

## Idempotency / Concurrency
Idempotent: removing a non-assigned label returns `204` as a no-op.

## Transaction Boundary
Delete from `DB-CARD-LABEL` plus one `DB-ACTIVITY-LOG` insert (`action_type = label_removed`), in one transaction.

## Database Impact
### READ
`DB-CARD-LABEL` (existence check)
### WRITE
`DB-CARD-LABEL` (delete), `DB-ACTIVITY-LOG` (insert)

## External Dependencies
None.

## Logging / Audit
Recorded in `DB-ACTIVITY-LOG`.

## Performance / Rate Limit
Standard write-endpoint rate limit. Broadcasts `card.label_removed` over the board's WebSocket channel.

## Related Feature / Screen / Tests
`FEAT-LABEL-ASSIGN`, `SCR-CARD-DETAIL`, `TC-LABEL-ASSIGN-001`
