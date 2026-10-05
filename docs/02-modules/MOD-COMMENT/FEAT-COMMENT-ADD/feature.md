---
code: FEAT-COMMENT-ADD
type: feature
title: Add / Edit / Delete Comment
status: draft
owner: Frontend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [comment]
related:
  modules: [MOD-COMMENT]
  features: []
  requirements: [REQ-COMMENT-001]
  business_rules: [BR-COMMENT-001]
  screens: [SCR-CARD-DETAIL]
  flows: [FLOW-COMMENT-ACTIVITY]
  apis: [API-COMMENT-CREATE, API-COMMENT-UPDATE, API-COMMENT-DELETE]
  database_objects: [DB-COMMENT]
  tests: [TC-COMMENT-ADD-001]
  decisions: []
---

# Feature Specification

## 1. Overview
Board members discuss a Card through a chronological comment thread in the card detail view.

## 2. Business Goal
Keep task-related discussion attached to the task itself rather than scattered across chat tools.

## 3. Actors
Any member of the Board's Workspace (comment); the comment's author or a workspace `owner`/`admin` (edit/delete, per `BR-COMMENT-001`).

## 4. Preconditions
Card exists and is not archived (`BR-CARD-003`).

## 5. Trigger
User types in the comment composer on `SCR-CARD-DETAIL` and submits.

## 6. Main Flow
1. User types a comment and submits -> `API-COMMENT-CREATE`.
2. Comment appears immediately in the thread, newest at the bottom, and generates one `DB-ACTIVITY-LOG` entry (`FLOW-COMMENT-ACTIVITY`).
3. Author later edits their comment inline -> `API-COMMENT-UPDATE`; an "edited" marker appears.
4. Author (or an owner/admin) deletes a comment -> `API-COMMENT-DELETE`; it is replaced by a tombstone placeholder.

## 7. Alternative Flows
None.

## 8. Error / Exception Flows
- Empty/too-long body -> `400 VALIDATION_ERROR`.
- Non-author, non-owner/admin attempts edit/delete -> `403 FORBIDDEN` (`BR-COMMENT-001`).
- Card archived -> `409 CARD_ARCHIVED` (`BR-CARD-003`).

## 9. Business Rules
`BR-COMMENT-001`

## 10. Screens / Routes
`SCR-CARD-DETAIL`

## 11. APIs
`API-COMMENT-CREATE`, `API-COMMENT-UPDATE`, `API-COMMENT-DELETE`

## 12. Database Objects
`DB-COMMENT`

## 13. Permissions
Any Workspace member can comment; edit/delete restricted per `BR-COMMENT-001`.

## 14. Notifications / External Effects
WebSocket `comment.created`/`comment.updated`/`comment.deleted` events sync other viewers.

## 15. Audit / Logging
One `DB-ACTIVITY-LOG` row per new comment (`action_type = comment_added`). Edits/deletes are not separately logged to `activity_log` in v1 (the comment row itself carries `edited_at`/`deleted_at`).

## 16. Acceptance Summary
Any board member can comment; only the author or a workspace owner/admin can edit or delete that comment; deleted comments leave a visible tombstone rather than disappearing silently.

## 17. Edge Cases
Editing a comment to empty text is rejected (same validation as creation) — use delete instead.

## 18. Dependencies
`FEAT-CARD-CREATE`

## 19. Known Limitations
No @mentions or rich formatting beyond plain markdown rendering in v1; no notification on new comment (see `OQ-005`).

## 20. Open Questions
`OQ-005` (notifications).
