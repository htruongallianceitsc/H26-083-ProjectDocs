---
code: REQ-BOARD-001
type: requirement
title: Create Board with Default Lists
status: draft
owner: Product Owner
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [board]
related:
  modules: [MOD-BOARD]
  features: [FEAT-BOARD-CREATE]
  requirements: []
  business_rules: [BR-BOARD-001]
  screens: []
  flows: []
  apis: []
  database_objects: []
  tests: [TC-BOARD-CREATE-001]
  decisions: []
---

# Requirement

## Statement
Any member of a Workspace must be able to create a Board in it, which is immediately seeded with 3 default Lists.

## Type
Functional

## Actor / Trigger
Workspace member; triggered from the workspace home screen.

## Expected Behaviour
Board and its 3 default Lists are created atomically.

## Rationale / Source
Removes the empty-board cold start.

## Priority
P0

## Acceptance Criteria
- Given a workspace member, when they create a board with a valid title, then the board exists with exactly 3 lists: "To Do", "In Progress", "Done".
- Given a non-member, when they attempt to create a board in that workspace, then the request is rejected.

## Dependencies
`FEAT-WORKSPACE-CREATE`

## Related Business Rules
`BR-BOARD-001`

## Verification
`TC-BOARD-CREATE-001`
