---
code: REQ-BOARD-002
type: requirement
title: Manage Board Settings and Archive
status: draft
owner: Product Owner
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [board]
related:
  modules: [MOD-BOARD]
  features: [FEAT-BOARD-MANAGE]
  requirements: []
  business_rules: [BR-BOARD-002]
  screens: []
  flows: []
  apis: []
  database_objects: []
  tests: [TC-BOARD-MANAGE-001]
  decisions: []
---

# Requirement

## Statement
An authorized user must be able to update a Board's title/background/visibility/star state and archive it.

## Type
Functional

## Actor / Trigger
Board creator or Workspace owner/admin; triggered from Board Settings.

## Expected Behaviour
An archived board becomes read-only across all list/card operations until restored.

## Rationale / Source
Keeps completed/inactive boards out of the way without losing data.

## Priority
P1

## Acceptance Criteria
- Given an authorized user, when they update the board title, then the new title is saved.
- Given an archived board, when any user attempts to create/update/move a list or card on it, then the request fails with `BOARD_ARCHIVED`.

## Dependencies
`FEAT-BOARD-CREATE`

## Related Business Rules
`BR-BOARD-002`

## Verification
`TC-BOARD-MANAGE-001`
