---
code: REQ-COMMENT-002
type: requirement
title: View Card Activity Log
status: draft
owner: Product Owner
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [activity]
related:
  modules: [MOD-COMMENT]
  features: [FEAT-ACTIVITY-LOG]
  requirements: []
  business_rules: []
  screens: []
  flows: []
  apis: []
  database_objects: []
  tests: [TC-ACTIVITY-LOG-001]
  decisions: []
---

# Requirement

## Statement
Any Workspace member must be able to view a chronological, human-readable activity feed for a Card.

## Type
Functional

## Actor / Trigger
Workspace member; triggered by opening a card.

## Expected Behaviour
Feed reflects every notable write action taken on the card, newest first.

## Rationale / Source
Built-in audit trail for transparency and debugging "what happened to this card".

## Priority
P2

## Acceptance Criteria
- Given a card that has been created, moved, and commented on, when a member views its activity feed, then all three events appear in reverse-chronological order.

## Dependencies
`FEAT-CARD-CREATE`, `FEAT-CARD-MOVE`, `FEAT-COMMENT-ADD` (and other write features that log activity)

## Related Business Rules
None specific.

## Verification
`TC-ACTIVITY-LOG-001`
