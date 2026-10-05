---
code: REQ-MEMBER-001
type: requirement
title: Assign or Remove a Card Member
status: draft
owner: Product Owner
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [member, card]
related:
  modules: [MOD-MEMBER]
  features: [FEAT-MEMBER-ASSIGN-CARD]
  requirements: []
  business_rules: [BR-MEMBER-001]
  screens: []
  flows: []
  apis: []
  database_objects: []
  tests: [TC-MEMBER-ASSIGN-CARD-001]
  decisions: []
---

# Requirement

## Statement
Any Workspace member must be able to assign or remove any other Workspace member on a Card.

## Type
Functional

## Actor / Trigger
Any board member; triggered from the card detail member picker.

## Expected Behaviour
Only Workspace members of the Card's Board are assignable; assignment is reflected on the card tile.

## Rationale / Source
Core responsibility-tracking workflow requested by the product owner.

## Priority
P2

## Acceptance Criteria
- Given a card and an unassigned workspace member, when a board member assigns them, then they appear on the card.
- Given a user who is not a member of the card's board's workspace, when someone attempts to assign them, then the request is rejected.

## Dependencies
`FEAT-CARD-CREATE`, `FEAT-WORKSPACE-MANAGE-MEMBERS`

## Related Business Rules
`BR-MEMBER-001`

## Verification
`TC-MEMBER-ASSIGN-CARD-001`
