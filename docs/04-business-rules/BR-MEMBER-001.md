---
code: BR-MEMBER-001
type: business-rule
title: Only Workspace Members Can Be Assigned to a Card
status: draft
owner: Product Owner
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [member, card]
related:
  modules: [MOD-MEMBER]
  features: [FEAT-MEMBER-ASSIGN-CARD]
  requirements: [REQ-MEMBER-001]
  business_rules: []
  screens: [SCR-CARD-DETAIL]
  flows: []
  apis: [API-CARD-MEMBER-ASSIGN]
  database_objects: [DB-CARD-MEMBER]
  tests: [TC-MEMBER-ASSIGN-CARD-001]
  decisions: []
---

# Business Rule

## Rule Statement
Only a user who is currently a member of the Card's Board's Workspace may be assigned to that Card. A user can be unassigned by themself or by any workspace `owner`/`admin`.

## Conditions
Checked on `API-CARD-MEMBER-ASSIGN` by looking up `DB-WORKSPACE-MEMBER` for the target user and the board's workspace.

## Result / Constraint
Assigning a non-member is rejected with `403 USER_NOT_WORKSPACE_MEMBER`.

## Exceptions
None.

## Scope / Effective Context
Per-card, scoped by the card's board's workspace membership.

## Positive Examples
Assigning any current workspace member to a card succeeds.

## Negative Examples
Attempting to assign a user who was removed from the workspace (or never belonged to it) -> rejected.

## Error / Message
`USER_NOT_WORKSPACE_MEMBER` — "This person is not a member of this workspace."

## Affected Features / Requirements / APIs / Screens
`FEAT-MEMBER-ASSIGN-CARD`, `REQ-MEMBER-001`, `API-CARD-MEMBER-ASSIGN`, `SCR-CARD-DETAIL`

## Test Coverage
`TC-MEMBER-ASSIGN-CARD-001`
