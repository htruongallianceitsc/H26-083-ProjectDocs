---
code: BR-CARD-002
type: business-rule
title: Due Date Must Not Precede Card Creation
status: draft
owner: Product Owner
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [card]
related:
  modules: [MOD-CARD]
  features: [FEAT-CARD-EDIT-DETAIL]
  requirements: [REQ-CARD-003]
  business_rules: []
  screens: [SCR-CARD-DETAIL]
  flows: []
  apis: [API-CARD-UPDATE]
  database_objects: [DB-CARD]
  tests: [TC-CARD-EDIT-DETAIL-001]
  decisions: []
---

# Business Rule

## Rule Statement
A Card's due date, when provided, must be a valid calendar date on or after the Card's `created_at` date. There is no restriction on clearing a due date or changing it later to any valid date on/after creation.

## Conditions
Checked on `API-CARD-UPDATE` whenever `dueDate` is present in the request.

## Result / Constraint
A `dueDate` earlier than the card's creation date is rejected.

## Exceptions
None.

## Scope / Effective Context
Per-card.

## Positive Examples
Setting a due date one week from today on a card created today.

## Negative Examples
Setting a due date of yesterday on a card created today -> rejected.

## Error / Message
`VALIDATION_ERROR` — `{ "dueDate": "Due date cannot be before the card was created." }`

## Affected Features / Requirements / APIs / Screens
`FEAT-CARD-EDIT-DETAIL`, `REQ-CARD-003`, `API-CARD-UPDATE`, `SCR-CARD-DETAIL`

## Test Coverage
`TC-CARD-EDIT-DETAIL-001`
