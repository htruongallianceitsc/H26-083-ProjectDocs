---
code: REQ-CARD-004
type: requirement
title: Archive Card
status: draft
owner: Product Owner
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [card]
related:
  modules: [MOD-CARD]
  features: [FEAT-CARD-ARCHIVE]
  requirements: []
  business_rules: [BR-CARD-003]
  screens: []
  flows: []
  apis: []
  database_objects: []
  tests: [TC-CARD-ARCHIVE-001]
  decisions: [ADR-005]
---

# Requirement

## Statement
A Workspace member must be able to archive a Card, removing it from the active board view while retaining it in the database.

## Type
Functional

## Actor / Trigger
Workspace member; triggered from the card tile menu or the card detail view.

## Expected Behaviour
Archiving is soft-delete; the card and its history are retained.

## Rationale / Source
Keeps boards focused on active work without losing history.

## Priority
P1

## Acceptance Criteria
- Given an active card, when a member archives it, then it disappears from the board for all viewers.
- Given an already-archived card, when a member attempts to archive it again, then the request is rejected.

## Dependencies
`FEAT-CARD-CREATE`

## Related Business Rules
`BR-CARD-003`

## Verification
`TC-CARD-ARCHIVE-001`
