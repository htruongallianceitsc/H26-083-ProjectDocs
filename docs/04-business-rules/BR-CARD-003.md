---
code: BR-CARD-003
type: business-rule
title: Archived Card is Hidden and Read-Only
status: draft
owner: Product Owner
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [card]
related:
  modules: [MOD-CARD]
  features: [FEAT-CARD-ARCHIVE]
  requirements: [REQ-CARD-004]
  business_rules: []
  screens: [SCR-BOARD, SCR-CARD-DETAIL]
  flows: []
  apis: [API-CARD-UPDATE, API-CARD-MOVE, API-LABEL-ASSIGN, API-LABEL-REMOVE, API-CARD-MEMBER-ASSIGN, API-CARD-MEMBER-REMOVE, API-COMMENT-CREATE]
  database_objects: [DB-CARD]
  tests: [TC-CARD-ARCHIVE-001]
  decisions: [ADR-005]
---

# Business Rule

## Rule Statement
A Card with `archived_at` set is hidden from the default board view and cannot be moved, edited, commented on, or have its labels/members changed. It must be restored (unarchived) first — a capability not yet exposed via the API/UI in v1 (known limitation, see `FEAT-CARD-ARCHIVE`).

## Conditions
Checked at the start of every card-mutating endpoint: `API-CARD-UPDATE`, `API-CARD-MOVE`, `API-LABEL-ASSIGN`/`API-LABEL-REMOVE`, `API-CARD-MEMBER-ASSIGN`/`API-CARD-MEMBER-REMOVE`, `API-COMMENT-CREATE`.

## Result / Constraint
All such requests against an archived card return `409 CARD_ARCHIVED`.

## Exceptions
`API-CARD-GET-DETAIL` (read) still works for an archived card if accessed by direct link, rendered read-only.

## Scope / Effective Context
Per-card.

## Positive Examples
Fetching an archived card's detail (e.g. from a direct link) succeeds and renders read-only.

## Negative Examples
Attempting to add a comment to an archived card -> `409 CARD_ARCHIVED`.

## Error / Message
`CARD_ARCHIVED` — "This card is archived and can't be changed."

## Affected Features / Requirements / APIs / Screens
`FEAT-CARD-ARCHIVE`, `REQ-CARD-004`, `API-CARD-UPDATE`, `API-CARD-MOVE`, `API-LABEL-ASSIGN`, `API-CARD-MEMBER-ASSIGN`, `API-COMMENT-CREATE`, `SCR-BOARD`, `SCR-CARD-DETAIL`

## Test Coverage
`TC-CARD-ARCHIVE-001`
