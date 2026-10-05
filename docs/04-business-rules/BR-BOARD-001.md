---
code: BR-BOARD-001
type: business-rule
title: Only Workspace Members Can Create Boards
status: draft
owner: Product Owner
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [board]
related:
  modules: [MOD-BOARD]
  features: [FEAT-BOARD-CREATE]
  requirements: [REQ-BOARD-001]
  business_rules: []
  screens: []
  flows: []
  apis: [API-BOARD-CREATE]
  database_objects: [DB-BOARD]
  tests: [TC-BOARD-CREATE-001]
  decisions: []
---

# Business Rule

## Rule Statement
Only a member (any role) of the target Workspace may create a Board in it. The creator can always manage that Board's settings regardless of their general workspace role (see `FEAT-BOARD-MANAGE`).

## Conditions
Checked on `API-BOARD-CREATE` against `DB-WORKSPACE-MEMBER`.

## Result / Constraint
Non-members are rejected with `403 FORBIDDEN`.

## Exceptions
None.

## Scope / Effective Context
Per-workspace.

## Positive Examples
A `member`-role user creates a board in their workspace successfully.

## Negative Examples
A user who is not a member of the workspace calls `API-BOARD-CREATE` for it -> rejected.

## Error / Message
`FORBIDDEN` — "You must be a member of this workspace to create a board."

## Affected Features / Requirements / APIs / Screens
`FEAT-BOARD-CREATE`, `REQ-BOARD-001`, `API-BOARD-CREATE`

## Test Coverage
`TC-BOARD-CREATE-001`
