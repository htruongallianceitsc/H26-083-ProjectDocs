---
code: BR-LABEL-001
type: business-rule
title: Label Name Uniqueness and Board Limit
status: draft
owner: Product Owner
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [label]
related:
  modules: [MOD-LABEL]
  features: [FEAT-LABEL-MANAGE]
  requirements: [REQ-LABEL-001]
  business_rules: []
  screens: []
  flows: []
  apis: [API-LABEL-CREATE, API-LABEL-UPDATE]
  database_objects: [DB-LABEL]
  tests: [TC-LABEL-MANAGE-001]
  decisions: []
---

# Business Rule

## Rule Statement
A Label's name must be unique within its Board, case-insensitively, between 1 and 40 characters. A Board may have at most 20 Labels.

## Conditions
Applies on `API-LABEL-CREATE` and whenever `API-LABEL-UPDATE` changes a label's `name`.

## Result / Constraint
- Creating/renaming to a name that case-insensitively matches another label on the same board is rejected.
- Creating a 21st label on a board is rejected.

## Exceptions
None.

## Scope / Effective Context
Per-board; the same name may be reused freely across different boards.

## Positive Examples
- Board has labels "Bug", "Feature"; creating "Urgent" succeeds (3rd of 20).

## Negative Examples
- Board has "Bug"; creating "bug" (different case) fails with `LABEL_NAME_DUPLICATE`.
- Board already has 20 labels; creating a 21st fails with `LABEL_LIMIT_REACHED`.

## Error / Message
`LABEL_NAME_DUPLICATE` — "A label with this name already exists on this board."
`LABEL_LIMIT_REACHED` — "This board already has the maximum of 20 labels."

## Affected Features / Requirements / APIs / Screens
`FEAT-LABEL-MANAGE`, `REQ-LABEL-001`, `API-LABEL-CREATE`, `API-LABEL-UPDATE`, `SCR-BOARD-SETTINGS`

## Test Coverage
`TC-LABEL-MANAGE-001`
