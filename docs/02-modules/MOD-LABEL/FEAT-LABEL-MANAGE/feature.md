---
code: FEAT-LABEL-MANAGE
type: feature
title: Manage Board Labels
status: draft
owner: Frontend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [label]
related:
  modules: [MOD-LABEL]
  features: []
  requirements: [REQ-LABEL-001]
  business_rules: [BR-LABEL-001]
  screens: [SCR-BOARD-SETTINGS]
  flows: []
  apis: [API-LABEL-CREATE, API-LABEL-UPDATE, API-LABEL-DELETE]
  database_objects: [DB-LABEL, DB-CARD-LABEL]
  tests: [TC-LABEL-MANAGE-001]
  decisions: []
---

# Feature Specification

## 1. Overview
Board owners/admins define and maintain the set of Labels available on a Board: create a new label (name + color), rename or recolor an existing one, or delete one entirely.

## 2. Business Goal
Give teams a consistent, board-wide vocabulary for categorizing cards (type of work, priority, status) that is faster to scan than reading every card title.

## 3. Actors
Board owner/admin (any Workspace member with `owner`/`admin` role, or the board's creator).

## 4. Preconditions
User is authenticated and is a member of the Board's Workspace.

## 5. Trigger
User opens Board Settings and navigates to the Labels section.

## 6. Main Flow
1. User opens `SCR-BOARD-SETTINGS` and views the current label palette.
2. User clicks "Add label", enters a name and picks a color, and saves (`API-LABEL-CREATE`).
3. The new label appears immediately in the palette and becomes available to assign on `SCR-CARD-DETAIL`.

## 7. Alternative Flows
- User edits an existing label's name/color (`API-LABEL-UPDATE`); all cards already showing that label reflect the new name/color immediately (label data is referenced by ID, not copied onto the card).
- User deletes a label (`API-LABEL-DELETE`); it disappears from every card that had it (cascade delete on `card_labels`).

## 8. Error / Exception Flows
- Duplicate name (case-insensitive) within the same board -> `LABEL_NAME_DUPLICATE` (`BR-LABEL-001`).
- Board already has 20 labels -> `LABEL_LIMIT_REACHED` (`BR-LABEL-001`).
- Non-owner/admin attempts to manage labels -> `403 FORBIDDEN`.

## 9. Business Rules
`BR-LABEL-001`

## 10. Screens / Routes
`SCR-BOARD-SETTINGS`

## 11. APIs
`API-LABEL-CREATE`, `API-LABEL-UPDATE`, `API-LABEL-DELETE`

## 12. Database Objects
`DB-LABEL` (primary), `DB-CARD-LABEL` (cascade on delete)

## 13. Permissions
Requires Workspace role `owner` or `admin`, or being the Board's creator.

## 14. Notifications / External Effects
None.

## 15. Audit / Logging
Label create/update/delete are not written to the per-card `activity_log` (they are board-level, not card-level events); standard application/API request logging applies.

## 16. Acceptance Summary
A user with sufficient permission can create, rename/recolor, and delete labels on a board; changes are reflected immediately everywhere the label is shown.

## 17. Edge Cases
- Deleting a label that is currently assigned to many cards removes it from all of them in one cascade.
- Two admins creating a label with the same name concurrently: the database `UNIQUE (board_id, name)` constraint guarantees only one succeeds; the loser receives `LABEL_NAME_DUPLICATE`.

## 18. Dependencies
Board must exist (`MOD-BOARD`).

## 19. Known Limitations
No label reordering/grouping in v1; labels display in creation order.

## 20. Open Questions
None blocking.
