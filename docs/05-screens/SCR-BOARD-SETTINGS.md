---
code: SCR-BOARD-SETTINGS
type: screen
title: Board Settings
status: draft
owner: Frontend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [board, screen]
route: /b/:boardId/settings
related:
  modules: [MOD-BOARD]
  features: [FEAT-BOARD-MANAGE, FEAT-LABEL-MANAGE]
  requirements: []
  business_rules: [BR-BOARD-002]
  screens: []
  flows: []
  apis: [API-BOARD-GET-DETAIL, API-BOARD-UPDATE, API-BOARD-ARCHIVE, API-LABEL-CREATE, API-LABEL-UPDATE, API-LABEL-DELETE]
  database_objects: []
  tests: [TC-BOARD-MANAGE-001]
  decisions: []
---

# Screen / Route

## Purpose
Let an authorized user edit board-level settings and manage the board's label palette.

## Route
`/b/:boardId/settings`

## Accessible Roles
Board creator or Workspace `owner`/`admin`.

## Entry Points
Settings link from `SCR-BOARD` header.

## Layout / Sections
Title field, background picker, visibility toggle, star toggle, "Archive board" danger-zone button, and a Labels section (list of labels with edit/delete, "Add label" form) — the Labels section is driven by `FEAT-LABEL-MANAGE` (`MOD-LABEL`).

## Fields

| Field | Type | Required | Validation | Notes |
|---|---|---:|---|---|
| title | text | Yes | 1-100 chars | |
| background | select | Yes | one of supported tokens | |
| visibility | select | Yes | workspace / private | private reserved for future use |
| labelName | text | Yes (per label row) | 1-40 chars, unique per board (`BR-LABEL-001`) | |
| labelColor | select | Yes (per label row) | one of supported color tokens | |

## Actions
Save settings, toggle star, archive board, add/edit/delete a label.

## Data Sources
`API-BOARD-GET-DETAIL`, `API-BOARD-UPDATE`, `API-BOARD-ARCHIVE`, `API-LABEL-CREATE`, `API-LABEL-UPDATE`, `API-LABEL-DELETE`

## UI States
- Initial
- Loading
- Success
- Empty — n/a
- Error
- No Permission (non-authorized viewer sees a 403 page, not a read-only variant, since settings are sensitive)

## Navigation Rules
"Archive board" asks for confirmation (in-page, not a native browser dialog) before calling `API-BOARD-ARCHIVE`, then redirects to `SCR-WORKSPACE-HOME`.

## Validation & Messages
Mirrors `DB-BOARD` and `DB-LABEL` constraints; `LABEL_LIMIT_REACHED`/`LABEL_NAME_DUPLICATE` shown inline on the label form.

## Responsive / Accessibility
Single-column settings form at tablet width.

## Related Features / Rules / APIs
`FEAT-BOARD-MANAGE`, `FEAT-LABEL-MANAGE`, `BR-BOARD-002`, `API-BOARD-UPDATE`, `API-BOARD-ARCHIVE`, `API-LABEL-CREATE`
