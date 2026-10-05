---
code: BR-LIST-002
type: business-rule
title: Fractional Position Ordering and Rebalancing
status: draft
owner: Backend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [list, card, ordering]
related:
  modules: [MOD-LIST]
  features: [FEAT-LIST-REORDER]
  requirements: [REQ-LIST-002]
  business_rules: []
  screens: [SCR-BOARD]
  flows: [FLOW-CARD-MOVE-DRAGDROP]
  apis: [API-LIST-REORDER, API-CARD-MOVE]
  database_objects: [DB-LIST, DB-CARD]
  tests: [TC-LIST-REORDER-001]
  decisions: [ADR-003]
---

# Business Rule

## Rule Statement
List position within a Board, and Card position within a List, are fractional `double precision` values (`ADR-003`). Inserting or moving an item between two siblings sets its position to the midpoint of its new neighbors' positions. If repeated insertions make the gap between two neighbors too small to split with floating-point precision, the server rebalances all sibling positions to evenly spaced integers as part of that same reorder request.

## Conditions
Applies to `API-LIST-REORDER` (list siblings on a board) and `API-CARD-MOVE` (card siblings within a list).

## Result / Constraint
A reorder/move normally touches exactly one row (the moved item). A rebalance (rare) touches every sibling row in that board/list, still within the same transaction as the triggering request.

## Exceptions
None — rebalancing is an internal implementation detail, transparent to the API caller (same success response shape either way).

## Scope / Effective Context
Per-board (list ordering), per-list (card ordering).

## Positive Examples
Moving a list between position 1.0 and 2.0 sets it to 1.5.

## Negative Examples
After many fine-grained insertions, two neighbors might be at 1.00000001 and 1.00000002; the next insert between them triggers a rebalance of that board's list positions to 1, 2, 3, ... before computing the new midpoint.

## Error / Message
No user-facing error — rebalancing is transparent. If a position computation somehow fails, the request returns a generic `500 INTERNAL_ERROR` and is safe to retry.

## Affected Features / Requirements / APIs / Screens
`FEAT-LIST-REORDER`, `REQ-LIST-002`, `API-LIST-REORDER`, `API-CARD-MOVE`, `SCR-BOARD`

## Test Coverage
`TC-LIST-REORDER-001`
