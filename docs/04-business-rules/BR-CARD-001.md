---
code: BR-CARD-001
type: business-rule
title: Card Move Scope and Optimistic Concurrency
status: draft
owner: Backend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [card, concurrency]
related:
  modules: [MOD-CARD]
  features: [FEAT-CARD-MOVE]
  requirements: [REQ-CARD-002]
  business_rules: []
  screens: [SCR-BOARD]
  flows: [FLOW-CARD-MOVE-DRAGDROP]
  apis: [API-CARD-MOVE]
  database_objects: [DB-CARD]
  tests: [TC-CARD-MOVE-001, TC-CARD-MOVE-002]
  decisions: []
---

# Business Rule

## Rule Statement
A Card can only be moved to a List on the SAME Board it currently belongs to (no cross-board move in v1). Every move request must include the Card's currently-known `updatedAt`; if it does not match the server's current value, the move is rejected as a conflict rather than applied.

## Conditions
Enforced on `API-CARD-MOVE`: target list's `board_id` must equal the card's current `board_id`; request `updatedAt` must equal the row's current `updated_at` at the start of the transaction.

## Result / Constraint
- Cross-board target -> `422 CROSS_BOARD_MOVE_NOT_SUPPORTED`.
- Stale `updatedAt` -> `409 CARD_MOVE_CONFLICT`, response includes the card's current state so the client can reconcile.

## Exceptions
None.

## Scope / Effective Context
Per-card, per-move-request.

## Positive Examples
Moving a card from "To Do" to "In Progress" on the same board, with the client's `updatedAt` matching the server's, succeeds.

## Negative Examples
Two users drag the same card at nearly the same instant; the second request's `updatedAt` no longer matches (the first already updated it) -> `409 CARD_MOVE_CONFLICT`.

## Error / Message
`CARD_MOVE_CONFLICT` — "This card changed since you last saw it. Refreshing its position."
`CROSS_BOARD_MOVE_NOT_SUPPORTED` — "Cards can't be moved to a different board yet."

## Affected Features / Requirements / APIs / Screens
`FEAT-CARD-MOVE`, `REQ-CARD-002`, `API-CARD-MOVE`, `SCR-BOARD`

## Test Coverage
`TC-CARD-MOVE-001`, `TC-CARD-MOVE-002`
