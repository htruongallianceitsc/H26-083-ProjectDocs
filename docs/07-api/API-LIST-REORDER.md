---
code: API-LIST-REORDER
type: api
title: Reorder List
status: draft
owner: Backend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [api, list, drag-and-drop]
method: PATCH
path: /api/lists/{listId}/position
related:
  modules: [MOD-LIST]
  features: [FEAT-LIST-REORDER]
  requirements: [REQ-LIST-002]
  business_rules: [BR-LIST-002, BR-BOARD-002]
  screens: [SCR-BOARD]
  flows: []
  apis: []
  database_objects: [DB-LIST]
  tests: [TC-LIST-REORDER-001]
  decisions: [ADR-003]
---

# API Contract

## Purpose
Move a List to a new position among its board's siblings (the drag-and-drop reorder endpoint for Lists).

## Endpoint
- Method: `PATCH`
- Path: `/api/lists/{listId}/position`
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
{ "beforeListId": "uuid-or-null", "afterListId": "uuid-or-null" }
```
At least one of `beforeListId`/`afterListId` is provided to anchor the drop point (both null means "move to the only/first position" — only valid on a board with 1 list, otherwise invalid).

## Response
### Success
`200 OK`
```json
{ "data": { "id": "uuid", "position": 1.5, "updatedAt": "2026-10-05T09:25:00Z" } }
```
### Errors
- `400 VALIDATION_ERROR` — neither anchor resolves to a valid sibling on the same board
- `401 UNAUTHENTICATED`
- `403 FORBIDDEN`
- `404 LIST_NOT_FOUND`
- `409 BOARD_ARCHIVED` (`BR-BOARD-002`)

## Validation
`beforeListId`/`afterListId`, when provided, must reference Lists on the same board as `listId`.

## Business Rules Applied
`BR-LIST-002` (fractional position computation, rebalance fallback), `BR-BOARD-002`

## Idempotency / Concurrency
Each call recomputes position from the current state; calling it twice with the same anchors is effectively idempotent since the midpoint of the same neighbors is the same value.

## Transaction Boundary
Read current sibling positions, compute the new value (rebalancing all siblings if needed, per `BR-LIST-002`), and write, all in one transaction.

## Database Impact
### READ
`DB-LIST` (sibling positions)
### WRITE
`DB-LIST` (position update — one row normally, all board's lists if a rebalance is triggered)

## External Dependencies
None.

## Logging / Audit
Standard request logging.

## Performance / Rate Limit
Standard write-endpoint rate limit. Broadcasts `list.reordered` over the board's WebSocket channel so other connected viewers reflect the new order without a manual refresh.

## Related Feature / Screen / Tests
`FEAT-LIST-REORDER`, `SCR-BOARD`, `TC-LIST-REORDER-001`
