---
code: FEAT-ACTIVITY-LOG
type: feature
title: Card Activity Log
status: draft
owner: Frontend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [activity, audit]
related:
  modules: [MOD-COMMENT]
  features: []
  requirements: [REQ-COMMENT-002]
  business_rules: []
  screens: [SCR-CARD-DETAIL]
  flows: [FLOW-CARD-MOVE-DRAGDROP, FLOW-COMMENT-ACTIVITY]
  apis: [API-ACTIVITY-LIST]
  database_objects: [DB-ACTIVITY-LOG]
  tests: [TC-ACTIVITY-LOG-001]
  decisions: []
---

# Feature Specification

## 1. Overview
A read-only, auto-generated, chronological feed of notable events on a Card — created, moved, labeled, member assigned/removed, commented, archived — shown below the comment thread.

## 2. Business Goal
Give every card a built-in audit trail so anyone can answer "what happened to this card and when?" without asking around.

## 3. Actors
Any member of the Board's Workspace (view only — this feed has no write actions of its own).

## 4. Preconditions
Card exists.

## 5. Trigger
User scrolls to the activity section of `SCR-CARD-DETAIL`.

## 6. Main Flow
1. Client fetches the feed via `API-ACTIVITY-LIST`, paginated newest-first.
2. Each entry renders as a one-line human-readable sentence (e.g. "Jane moved this card from To Do to In Progress") derived from `action_type` + `metadata`.

## 7. Alternative Flows
None.

## 8. Error / Exception Flows
None beyond standard not-found/authorization errors on the underlying card.

## 9. Business Rules
None specific — this feature only reads what other features' business rules already produced.

## 10. Screens / Routes
`SCR-CARD-DETAIL`

## 11. APIs
`API-ACTIVITY-LIST`

## 12. Database Objects
`DB-ACTIVITY-LOG`

## 13. Permissions
Any Workspace member.

## 14. Notifications / External Effects
None (read-only).

## 15. Audit / Logging
This feature IS the audit log presentation layer; it does not itself write to `DB-ACTIVITY-LOG`.

## 16. Acceptance Summary
Any board member can view a complete, chronological, human-readable history of notable events for a card.

## 17. Edge Cases
A brand-new card's feed shows exactly one entry: "created".

## 18. Dependencies
Every other write feature that inserts into `DB-ACTIVITY-LOG` (`FEAT-CARD-CREATE`, `FEAT-CARD-MOVE`, `FEAT-CARD-ARCHIVE`, `FEAT-LABEL-ASSIGN`, `FEAT-MEMBER-ASSIGN-CARD`, `FEAT-COMMENT-ADD`).

## 19. Known Limitations
No board-level (cross-card) activity view in v1 — only per-card.

## 20. Open Questions
None blocking.
