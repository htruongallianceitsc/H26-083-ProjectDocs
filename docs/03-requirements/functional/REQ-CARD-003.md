---
code: REQ-CARD-003
type: requirement
title: Edit Card Detail
status: draft
owner: Product Owner
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [card]
related:
  modules: [MOD-CARD]
  features: [FEAT-CARD-EDIT-DETAIL]
  requirements: []
  business_rules: [BR-CARD-002]
  screens: []
  flows: []
  apis: []
  database_objects: []
  tests: [TC-CARD-EDIT-DETAIL-001]
  decisions: []
---

# Requirement

## Statement
A Workspace member must be able to view and edit a Card's title, description, and due date.

## Type
Functional

## Actor / Trigger
Workspace member; triggered by opening a card.

## Expected Behaviour
Field edits save independently without requiring a full-form submit.

## Rationale / Source
Cards need a place to hold full context beyond the board tile.

## Priority
P0

## Acceptance Criteria
- Given an open card, when a member edits the description, then it is saved and visible on next load.
- Given a due date earlier than the card's creation date, when a member tries to set it, then the request is rejected.

## Dependencies
`FEAT-CARD-CREATE`

## Related Business Rules
`BR-CARD-002`

## Verification
`TC-CARD-EDIT-DETAIL-001`
