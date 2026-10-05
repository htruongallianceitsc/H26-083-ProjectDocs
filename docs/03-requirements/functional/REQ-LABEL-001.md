---
code: REQ-LABEL-001
type: requirement
title: Manage Board Labels
status: draft
owner: Product Owner
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [label]
related:
  modules: [MOD-LABEL]
  features: [FEAT-LABEL-MANAGE]
  requirements: []
  business_rules: [BR-LABEL-001]
  screens: []
  flows: []
  apis: []
  database_objects: []
  tests: [TC-LABEL-MANAGE-001]
  decisions: []
---

# Requirement

## Statement
A Board owner/admin must be able to create, rename/recolor, and delete labels scoped to that Board.

## Type
Functional

## Actor / Trigger
Board owner/admin; triggered from Board Settings.

## Expected Behaviour
Label names are unique per board (case-insensitive), up to 20 labels per board. Editing or deleting a label immediately affects every card that references it.

## Rationale / Source
Core Trello-style categorization capability requested by the product owner.

## Priority
P1

## Acceptance Criteria
- Given a board with fewer than 20 labels, when an owner/admin creates a label with a unique name, then it is saved and appears in the palette.
- Given a board at 20 labels, when an owner/admin tries to add another, then the request is rejected with `LABEL_LIMIT_REACHED`.
- Given an existing label, when it is deleted, then it is removed from every card that had it.

## Dependencies
Board must exist (`MOD-BOARD`).

## Related Business Rules
`BR-LABEL-001`

## Verification
`TC-LABEL-MANAGE-001`
