---
code: SCR-CARD-DETAIL
type: screen
title: Card Detail
status: draft
owner: Frontend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [card, screen]
route: /b/:boardId/c/:cardId
related:
  modules: [MOD-CARD]
  features: [FEAT-CARD-EDIT-DETAIL, FEAT-CARD-ARCHIVE, FEAT-LABEL-ASSIGN, FEAT-MEMBER-ASSIGN-CARD, FEAT-COMMENT-ADD, FEAT-ACTIVITY-LOG]
  requirements: []
  business_rules: [BR-CARD-003]
  screens: []
  flows: []
  apis: [API-CARD-GET-DETAIL, API-CARD-UPDATE, API-CARD-ARCHIVE]
  database_objects: []
  tests: []
  decisions: []
---

# Screen / Route

## Purpose
Full detail view of a single Card, rendered as a modal over `SCR-BOARD`: title/description/due-date editing, label and member assignment, comments, and the activity feed.

## Route
`/b/:boardId/c/:cardId`

## Accessible Roles
Any member of the Board's Workspace (read-only if the card is archived, per `BR-CARD-003`).

## Entry Points
Clicking a card tile on `SCR-BOARD`; a direct/shared link to the card URL.

## Layout / Sections
- Header: editable title, archive button, close (back to board).
- Main column: description editor, due date picker, comment composer + chronological comment thread, activity feed (from `FEAT-ACTIVITY-LOG`).
- Sidebar: members picker (`FEAT-MEMBER-ASSIGN-CARD`), labels picker (`FEAT-LABEL-ASSIGN`).

## Fields

| Field | Type | Required | Validation | Notes |
|---|---|---:|---|---|
| title | text | Yes | 1-200 chars | inline editable |
| description | textarea (markdown) | No | up to a reasonable length limit | autosaves on blur |
| dueDate | date | No | on/after card creation date (`BR-CARD-002`) | |
| newComment | textarea | Yes (to submit) | 1-5000 chars | |

## Actions
Edit title/description/due date, archive card, assign/remove labels, assign/remove members, add/edit/delete a comment, scroll the activity feed.

## Data Sources
`API-CARD-GET-DETAIL` (initial load, including labels/members/comments summary), `API-CARD-UPDATE`, `API-CARD-ARCHIVE`, plus the label/member/comment/activity APIs owned by other modules (`API-LABEL-ASSIGN`, `API-CARD-MEMBER-ASSIGN`, `API-COMMENT-CREATE`, `API-ACTIVITY-LIST`). Also receives live updates over the board's WebSocket channel.

## UI States
- Initial
- Loading
- Success
- Empty — n/a (a card always has at least a title)
- Error (e.g. card not found/deleted -> redirect to board with a toast)
- No Permission (non-workspace-member -> 403)
- Read-only banner when the card is archived (`BR-CARD-003`)

## Navigation Rules
Closing the modal (X or Escape) returns to `/b/:boardId` without a full page reload.

## Validation & Messages
Mirrors `DB-CARD` constraints and `BR-CARD-002`; archived-card mutation attempts are prevented client-side (controls disabled) in addition to the server-side `BR-CARD-003` check.

## Responsive / Accessibility
On narrow viewports the modal becomes a full-screen view instead of an overlay; sidebar sections collapse below the main content.

## Related Features / Rules / APIs
`FEAT-CARD-EDIT-DETAIL`, `FEAT-CARD-ARCHIVE`, `FEAT-LABEL-ASSIGN`, `FEAT-MEMBER-ASSIGN-CARD`, `FEAT-COMMENT-ADD`, `FEAT-ACTIVITY-LOG`, `BR-CARD-003`, `API-CARD-GET-DETAIL`, `API-CARD-UPDATE`, `API-CARD-ARCHIVE`
