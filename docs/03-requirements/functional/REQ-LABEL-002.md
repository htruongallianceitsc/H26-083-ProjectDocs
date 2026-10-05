---
code: REQ-LABEL-002
type: requirement
title: Assign or Remove a Label on a Card
status: draft
owner: Product Owner
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [label, card]
related:
  modules: [MOD-LABEL]
  features: [FEAT-LABEL-ASSIGN]
  requirements: []
  business_rules: []
  screens: []
  flows: []
  apis: []
  database_objects: []
  tests: [TC-LABEL-ASSIGN-001]
  decisions: []
---

# Requirement

## Statement
Any Workspace member must be able to assign or remove any of the Board's labels on a Card.

## Type
Functional

## Actor / Trigger
Any board member; triggered from the card detail label picker.

## Expected Behaviour
Toggling a label on/off is a single-click, idempotent action reflected immediately for the acting user and, via realtime sync, for other viewers of the same board.

## Rationale / Source
Core categorization workflow requested by the product owner.

## Priority
P1

## Acceptance Criteria
- Given a card and an unassigned board label, when a member assigns it, then the label appears on the card and on its board tile.
- Given a card with an assigned label, when a member removes it, then the label disappears from the card and its board tile.

## Dependencies
At least one Label must exist on the Board (`FEAT-LABEL-MANAGE`).

## Related Business Rules
None specific.

## Verification
`TC-LABEL-ASSIGN-001`
