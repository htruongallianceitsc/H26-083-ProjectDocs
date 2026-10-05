---
code: FEAT-CARD-EDIT-DETAIL
type: feature
title: Edit Card Detail
status: draft
owner: Frontend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [card]
related:
  modules: [MOD-CARD]
  features: []
  requirements: [REQ-CARD-003]
  business_rules: [BR-CARD-002, BR-CARD-003]
  screens: [SCR-CARD-DETAIL]
  flows: []
  apis: [API-CARD-GET-DETAIL, API-CARD-UPDATE]
  database_objects: [DB-CARD]
  tests: [TC-CARD-EDIT-DETAIL-001]
  decisions: []
---

# Feature Specification

## 1. Overview
A board member opens a Card to read/edit its title, description, and due date.

## 2. Business Goal
Give every card a place to hold the full context needed to complete the work, beyond the board tile's title-only view.

## 3. Actors
Any member of the Board's Workspace.

## 4. Preconditions
Card exists and is not archived (`BR-CARD-003`).

## 5. Trigger
User clicks a card tile on `SCR-BOARD`.

## 6. Main Flow
1. Client navigates to `SCR-CARD-DETAIL` and fetches the card via `API-CARD-GET-DETAIL`.
2. User edits title (inline), description (markdown textarea), and/or due date (date picker).
3. Each field saves independently (autosave on blur / date selection) via `API-CARD-UPDATE`.

## 7. Alternative Flows
None — labels/members/comments/activity on this same screen are separate features (`FEAT-LABEL-ASSIGN`, `FEAT-MEMBER-ASSIGN-CARD`, `FEAT-COMMENT-ADD`, `FEAT-ACTIVITY-LOG`).

## 8. Error / Exception Flows
Invalid due date (before card creation date) -> `400 VALIDATION_ERROR` (`BR-CARD-002`). Card archived -> `409 CARD_ARCHIVED` (`BR-CARD-003`), detail view becomes read-only with an "Archived" banner and a restore action is out of scope for v1.

## 9. Business Rules
`BR-CARD-002`, `BR-CARD-003`

## 10. Screens / Routes
`SCR-CARD-DETAIL`

## 11. APIs
`API-CARD-GET-DETAIL`, `API-CARD-UPDATE`

## 12. Database Objects
`DB-CARD`

## 13. Permissions
Any Workspace member.

## 14. Notifications / External Effects
WebSocket `card.updated` broadcast so the board tile (if it shows a description/due-date indicator) and other open detail views update live.

## 15. Audit / Logging
Significant edits (title/description/due-date change) are not individually itemized in `activity_log` in v1 beyond the generic `card_created`/`card_moved`/`card_archived` events — full field-level edit history is a future enhancement.

## 16. Acceptance Summary
A board member can open any active card and edit its title, description, and due date, with changes saved incrementally.

## 17. Edge Cases
Clearing the due date (setting it back to empty) is allowed at any time.

## 18. Dependencies
`FEAT-CARD-CREATE`

## 19. Known Limitations
No attachments or checklist sub-items in v1 (`docs/00-project/product-scope.md` Out of Scope); no field-level edit history.

## 20. Open Questions
`OQ-003` (attachments), `OQ-004` (checklists).
