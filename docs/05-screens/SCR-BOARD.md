---
code: SCR-BOARD
type: screen
title: Board
status: draft
owner: Frontend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [board, screen, kanban]
route: /b/:boardId
related:
  modules: [MOD-BOARD]
  features: [FEAT-BOARD-CREATE, FEAT-LIST-MANAGE, FEAT-LIST-REORDER, FEAT-CARD-CREATE, FEAT-CARD-MOVE]
  requirements: []
  business_rules: [BR-BOARD-002]
  screens: []
  flows: [FLOW-CARD-MOVE-DRAGDROP]
  apis: [API-BOARD-GET-DETAIL, API-LIST-CREATE, API-LIST-REORDER, API-CARD-CREATE, API-CARD-MOVE]
  database_objects: []
  tests: []
  decisions: []
---

# Screen / Route

## Purpose
The core kanban view: shows a Board's Lists as columns and Cards as draggable tiles within them. This is the screen users spend the most time on.

## Route
`/b/:boardId`

## Accessible Roles
Any member of the Board's Workspace (view and edit); an archived board is shown read-only (`BR-BOARD-002`).

## Entry Points
Clicking a board from `SCR-WORKSPACE-HOME`.

## Layout / Sections
Board header (title, members avatars, star toggle, settings link to `SCR-BOARD-SETTINGS`), horizontally-scrollable row of List columns, each with a header (title, card count, list menu), an ordered stack of Card tiles, and an "Add card" affordance at the bottom; an "Add list" affordance at the end of the row.

## Fields

| Field | Type | Required | Validation | Notes |
|---|---|---:|---|---|
| newListTitle | text | Yes | 1-60 chars | inline input shown when adding a list |
| newCardTitle | text | Yes | 1-200 chars | inline input shown when adding a card |

## Actions
Add list, rename list (inline), add card, open card (-> `SCR-CARD-DETAIL`), drag-and-drop a list to reorder, drag-and-drop a card within/across lists, archive a list.

## Data Sources
`API-BOARD-GET-DETAIL` (initial load: board + nested lists + cards), `API-LIST-CREATE`, `API-LIST-REORDER`, `API-CARD-CREATE`, `API-CARD-MOVE`. Also receives live updates over the board's WebSocket channel (`docs/07-api/conventions.md`).

## UI States
- Initial
- Loading
- Success
- Empty (new board before any cards are added on its default lists — still shows the 3 default lists)
- Error
- No Permission (user is not a workspace member -> 403 page)

## Navigation Rules
Clicking a card tile opens `SCR-CARD-DETAIL` as a modal over this screen (URL becomes `/b/:boardId/c/:cardId`), so the board stays mounted underneath.

## Validation & Messages
List/card title length enforced client-side (mirrors `DB-LIST`/`DB-CARD` constraints); drag-and-drop operations use optimistic UI and roll back with a toast if the server rejects (e.g. `CARD_MOVE_CONFLICT`, `BOARD_ARCHIVED`).

## Responsive / Accessibility
Lists scroll horizontally on narrow viewports; drag-and-drop has a keyboard-accessible fallback (move-to-list menu) for users who cannot use pointer drag.

## Related Features / Rules / APIs
`FEAT-BOARD-CREATE`, `FEAT-LIST-MANAGE`, `FEAT-LIST-REORDER`, `FEAT-CARD-CREATE`, `FEAT-CARD-MOVE`, `BR-BOARD-002`, `API-BOARD-GET-DETAIL`, `API-LIST-CREATE`, `API-LIST-REORDER`, `API-CARD-CREATE`, `API-CARD-MOVE`
