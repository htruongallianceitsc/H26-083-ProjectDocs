---
code: BR-LIST-001
type: business-rule
title: Archived List Cannot Accept New Cards
status: draft
owner: Product Owner
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [list]
related:
  modules: [MOD-LIST]
  features: [FEAT-LIST-MANAGE]
  requirements: [REQ-LIST-001]
  business_rules: []
  screens: [SCR-BOARD]
  flows: []
  apis: [API-LIST-UPDATE, API-CARD-CREATE, API-CARD-MOVE]
  database_objects: [DB-LIST]
  tests: [TC-LIST-MANAGE-001]
  decisions: []
---

# Business Rule

## Rule Statement
A List with `archived_at` set is hidden from the default board view. New cards cannot be created in it, and existing cards cannot be moved into it.

## Conditions
Checked on `API-CARD-CREATE` (target list) and `API-CARD-MOVE` (target list).

## Result / Constraint
Such requests are rejected with `409 LIST_ARCHIVED`.

## Exceptions
A list with existing (non-archived) cards can still be archived; those cards become inaccessible from the default board view until the list is restored, not deleted.

## Scope / Effective Context
Per-list.

## Positive Examples
Creating a card in an active list succeeds.

## Negative Examples
Calling `API-CARD-CREATE` against an archived list's id -> `409 LIST_ARCHIVED`.

## Error / Message
`LIST_ARCHIVED` — "This list is archived and cannot accept cards."

## Affected Features / Requirements / APIs / Screens
`FEAT-LIST-MANAGE`, `REQ-LIST-001`, `API-LIST-UPDATE`, `API-CARD-CREATE`, `API-CARD-MOVE`, `SCR-BOARD`

## Test Coverage
`TC-LIST-MANAGE-001`
