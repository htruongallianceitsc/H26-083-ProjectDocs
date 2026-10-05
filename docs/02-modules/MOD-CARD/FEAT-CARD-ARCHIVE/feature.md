---
code: FEAT-CARD-ARCHIVE
type: feature
title: Archive Card
status: draft
owner: Frontend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [card]
related:
  modules: [MOD-CARD]
  features: []
  requirements: [REQ-CARD-004]
  business_rules: [BR-CARD-003]
  screens: [SCR-CARD-DETAIL, SCR-BOARD]
  flows: [FLOW-CARD-LIFECYCLE]
  apis: [API-CARD-ARCHIVE]
  database_objects: [DB-CARD]
  tests: [TC-CARD-ARCHIVE-001]
  decisions: [ADR-005]
---

# Feature Specification

## 1. Overview
A board member archives a Card once its work is done or it's no longer relevant, removing it from the board view without deleting its history.

## 2. Business Goal
Keep boards focused on active work while preserving history for later reference.

## 3. Actors
Any member of the Board's Workspace.

## 4. Preconditions
Card exists and is not already archived.

## 5. Trigger
User clicks "Archive" from the card tile's context menu on `SCR-BOARD`, or the "Archive" button in `SCR-CARD-DETAIL`.

## 6. Main Flow
1. User triggers archive -> `API-CARD-ARCHIVE`.
2. Card tile disappears from `SCR-BOARD` immediately (optimistic); if open, `SCR-CARD-DETAIL` closes and returns to the board.
3. Other connected viewers see the card disappear via a `card.archived` WebSocket event.

## 7. Alternative Flows
None — unarchive/restore is not exposed in v1 (see Known Limitations).

## 8. Error / Exception Flows
Card already archived -> `409 ALREADY_ARCHIVED`.

## 9. Business Rules
`BR-CARD-003`

## 10. Screens / Routes
`SCR-CARD-DETAIL`, `SCR-BOARD`

## 11. APIs
`API-CARD-ARCHIVE`

## 12. Database Objects
`DB-CARD`

## 13. Permissions
Any Workspace member.

## 14. Notifications / External Effects
WebSocket `card.archived` broadcast.

## 15. Audit / Logging
One `DB-ACTIVITY-LOG` row (`action_type = card_archived`).

## 16. Acceptance Summary
A board member can archive any active card; it disappears from the board for everyone, without being deleted from the database.

## 17. Edge Cases
Archiving a card does not archive its comments or activity log — they are retained and still retrievable if the card is restored via direct database action (no UI restore path yet).

## 18. Dependencies
`FEAT-CARD-CREATE`

## 19. Known Limitations
No "restore archived card" UI in v1 — this is the single biggest known gap in the Card lifecycle and is tracked as an open item.

## 20. Open Questions
Restore/unarchive UI is tracked in `docs/19-open-items/open-questions.md` as a near-term follow-up, not a numbered OQ in this round (low ambiguity, just not yet built).
