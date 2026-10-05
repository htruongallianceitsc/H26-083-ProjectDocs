---
code: REQ-LIST-001
type: requirement
title: Manage Lists
status: draft
owner: Product Owner
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [list]
related:
  modules: [MOD-LIST]
  features: [FEAT-LIST-MANAGE]
  requirements: []
  business_rules: [BR-LIST-001]
  screens: []
  flows: []
  apis: []
  database_objects: []
  tests: [TC-LIST-MANAGE-001]
  decisions: []
---

# Requirement

## Statement
A Workspace member must be able to create, rename, and archive Lists on an active Board.

## Type
Functional

## Actor / Trigger
Workspace member; triggered from the board view.

## Expected Behaviour
New lists append at the end; archived lists are hidden from the default board view and cannot accept new cards.

## Rationale / Source
Lists are the user-defined workflow columns, core to the Trello interaction model.

## Priority
P0

## Acceptance Criteria
- Given an active board, when a member creates a list with a valid title, then it appears at the end of the board.
- Given an archived list, when any user attempts to add a card to it, then the request is rejected.

## Dependencies
`FEAT-BOARD-CREATE`

## Related Business Rules
`BR-LIST-001`

## Verification
`TC-LIST-MANAGE-001`
