---
code: API-CARD-MOVE
type: api
title: Move Card
status: draft
owner: Backend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [api, card, drag-and-drop, realtime]
method: PATCH
path: /api/cards/{cardId}/move
related:
  modules: [MOD-CARD]
  features: [FEAT-CARD-MOVE]
  requirements: [REQ-CARD-002]
  business_rules: [BR-CARD-001, BR-LIST-001, BR-LIST-002, BR-BOARD-002]
  screens: [SCR-BOARD]
  flows: [FLOW-CARD-MOVE-DRAGDROP]
  apis: []
  database_objects: [DB-CARD, DB-ACTIVITY-LOG]
  tests: [TC-CARD-MOVE-001, TC-CARD-MOVE-002]
  decisions: [ADR-003, ADR-004]
---

# API Contract

## Purpose
Move a Card to a new List and/or position on the same Board — the backend contract for the product's signature drag-and-drop interaction. This is the single most concurrency-sensitive and most frequently called write endpoint in the system.

## Endpoint
- Method: `PATCH`
- Path: `/api/cards/{cardId}/move`
- Version: `v1`

## Authentication / Authorization
Bearer JWT required. Caller must be a member of the Card's (current) Board's Workspace.

## Request
### Headers
`Authorization: Bearer <token>`, `Content-Type: application/json`
### Path Parameters
`cardId` (uuid, required)
### Query Parameters
None
### Body
```json
{
  "targetListId": "uuid",
  "beforeCardId": "uuid-or-null",
  "afterCardId": "uuid-or-null",
  "updatedAt": "2026-10-05T09:00:00Z"
}
```
- `targetListId`: the list the card should end up in (may equal its current list for a same-list reorder).
- `beforeCardId` / `afterCardId`: the sibling cards (in the target list) the dropped card should land between — at least one must be provided unless the target list is empty.
- `updatedAt`: the card's `updatedAt` value as last known by the client, used for the optimistic-concurrency check (`BR-CARD-001`).

## Response
### Success
`200 OK`
```json
{ "data": { "id": "uuid", "listId": "uuid", "boardId": "uuid", "position": 2.5, "updatedAt": "2026-10-05T09:31:00Z" } }
```
### Errors
- `400 VALIDATION_ERROR` — missing/invalid anchors
- `401 UNAUTHENTICATED`
- `403 FORBIDDEN` — not a workspace member
- `404 CARD_NOT_FOUND` / `404 LIST_NOT_FOUND`
- `409 CARD_MOVE_CONFLICT` — `updatedAt` mismatch (`BR-CARD-001`); response body includes the card's current authoritative state under `data` so the client can reconcile without a second round trip
- `409 LIST_ARCHIVED` (`BR-LIST-001`)
- `409 BOARD_ARCHIVED` (`BR-BOARD-002`)
- `409 CARD_ARCHIVED` (`BR-CARD-003`)
- `422 CROSS_BOARD_MOVE_NOT_SUPPORTED` (`BR-CARD-001`)

## Validation
`targetListId` required. `beforeCardId`/`afterCardId`, when provided, must be cards currently in `targetListId`.

## Business Rules Applied
`BR-CARD-001` (scope + concurrency), `BR-LIST-001` (target list not archived), `BR-LIST-002` (fractional position computation, shared mechanism with `API-LIST-REORDER`), `BR-BOARD-002` (board not archived).

## Idempotency / Concurrency
This is the system's primary optimistic-concurrency example: the server reads the card row with its current `updated_at` inside the transaction, compares it to the request's `updatedAt`, and aborts with `409 CARD_MOVE_CONFLICT` on mismatch rather than silently overwriting a move that happened in between. A retried request with a refreshed `updatedAt` is safe and expected (the client's standard conflict-recovery path).

## Transaction Boundary
In one transaction: (1) re-check `updated_at` matches, (2) verify target list/board are not archived, (3) compute the new fractional `position` between `beforeCardId`/`afterCardId` (rebalancing the target list's card positions if the gap is too small, per `BR-LIST-002`), (4) update `list_id`, `board_id`, `position`, `updated_at` on the card, (5) insert one `DB-ACTIVITY-LOG` row (`action_type = card_moved`, `metadata = { fromListId, toListId }`). All five steps commit or roll back together.

## Database Impact
### READ
`DB-CARD` (the moved card + its target-list siblings), `DB-LIST` (target list archived check), `DB-BOARD` (archived check)
### WRITE
`DB-CARD` (the moved card's row, plus sibling rows only if a `BR-LIST-002` rebalance triggers), `DB-ACTIVITY-LOG` (insert)

## External Dependencies
None.

## Logging / Audit
Every successful move is recorded in `DB-ACTIVITY-LOG`, which powers `FEAT-ACTIVITY-LOG`.

## Performance / Rate Limit
This endpoint must stay low-latency since it sits directly in the drag-and-drop interaction path (see `NFR-PERF-001`, `NFR-PERF-002`). On success, the server broadcasts a `card.moved` event — containing `cardId`, `fromListId`, `toListId`, `position` — over the Board's WebSocket channel (`ARCH-004`) so every other connected client updates its view without polling.

## Related Feature / Screen / Tests
`FEAT-CARD-MOVE`, `SCR-BOARD`, `TC-CARD-MOVE-001`, `TC-CARD-MOVE-002`
