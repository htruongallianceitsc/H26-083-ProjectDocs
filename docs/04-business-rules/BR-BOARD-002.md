---
code: BR-BOARD-002
type: business-rule
title: Archived Board is Read-Only
status: draft
owner: Product Owner
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [board]
related:
  modules: [MOD-BOARD]
  features: [FEAT-BOARD-MANAGE]
  requirements: [REQ-BOARD-002]
  business_rules: []
  screens: []
  flows: []
  apis: [API-LIST-CREATE, API-LIST-UPDATE, API-LIST-REORDER, API-CARD-CREATE, API-CARD-UPDATE, API-CARD-MOVE, API-CARD-ARCHIVE]
  database_objects: [DB-BOARD]
  tests: [TC-BOARD-MANAGE-001]
  decisions: [ADR-005]
---

# Business Rule

## Rule Statement
When a Board's `archived_at` is set, every List/Card create/update/move/archive endpoint scoped to that board rejects the request with `409 BOARD_ARCHIVED`. Board settings (`API-BOARD-UPDATE`, including unarchiving) remain callable by an authorized user.

## Conditions
Checked at the start of every List/Card mutating endpoint by looking up the owning board's `archived_at`.

## Result / Constraint
Mutating requests on an archived board's lists/cards fail; the board itself can still be updated/unarchived.

## Exceptions
None.

## Scope / Effective Context
Per-board, cascades to all lists/cards within it.

## Positive Examples
Viewing (`API-BOARD-GET-DETAIL`) an archived board still works (read-only display).

## Negative Examples
Calling `API-CARD-MOVE` on a card belonging to an archived board -> `409 BOARD_ARCHIVED`.

## Error / Message
`BOARD_ARCHIVED` — "This board is archived. Unarchive it to make changes."

## Affected Features / Requirements / APIs / Screens
`FEAT-BOARD-MANAGE`, `REQ-BOARD-002`, `API-LIST-CREATE`, `API-LIST-UPDATE`, `API-LIST-REORDER`, `API-CARD-CREATE`, `API-CARD-UPDATE`, `API-CARD-MOVE`, `API-CARD-ARCHIVE`

## Test Coverage
`TC-BOARD-MANAGE-001`
