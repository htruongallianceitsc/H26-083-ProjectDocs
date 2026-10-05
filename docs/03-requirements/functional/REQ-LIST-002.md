---
code: REQ-LIST-002
type: requirement
title: Reorder Lists via Drag-and-Drop
status: draft
owner: Product Owner
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [list, drag-and-drop]
related:
  modules: [MOD-LIST]
  features: [FEAT-LIST-REORDER]
  requirements: []
  business_rules: [BR-LIST-002]
  screens: []
  flows: []
  apis: []
  database_objects: []
  tests: [TC-LIST-REORDER-001]
  decisions: [ADR-003]
---

# Requirement

## Statement
A Workspace member must be able to reorder a Board's Lists via drag-and-drop, with the new order persisted and synced to other viewers.

## Type
Functional

## Actor / Trigger
Workspace member; triggered by dragging a list header.

## Expected Behaviour
Reordering uses fractional-index positions (`ADR-003`) so only the moved list's row is written.

## Rationale / Source
Core kanban interaction explicitly requested (drag-and-drop).

## Priority
P1

## Acceptance Criteria
- Given a board with 3 lists, when a member drags the 3rd list to the 1st position, then the server returns the lists in the new order on the next fetch, and only one list row's `position` changed.

## Dependencies
`FEAT-LIST-MANAGE`

## Related Business Rules
`BR-LIST-002`

## Verification
`TC-LIST-REORDER-001`
