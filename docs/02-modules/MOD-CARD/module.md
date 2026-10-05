---
code: MOD-CARD
type: module
title: Card Management
status: draft
owner: Frontend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [card, kanban]
related:
  modules: []
  features: [FEAT-CARD-CREATE, FEAT-CARD-MOVE, FEAT-CARD-EDIT-DETAIL, FEAT-CARD-ARCHIVE]
  requirements: []
  business_rules: []
  screens: []
  flows: []
  apis: []
  database_objects: [DB-CARD]
  tests: []
  decisions: [ADR-003, ADR-005]
---

# Module

## Purpose
Owns the Card — the core work item of the product — covering creation, the signature drag-and-drop move, detail editing, and archiving.

## Scope
Card lifecycle and ordering. Labels (`MOD-LABEL`), members (`MOD-MEMBER`), and comments/activity (`MOD-COMMENT`) are separate modules that attach to a Card but are documented independently.

## Feature Inventory

| Feature Code | Title | Priority | Status |
|---|---|---|---|
| FEAT-CARD-CREATE | Create Card | P0 | draft |
| FEAT-CARD-MOVE | Move Card (drag-and-drop) | P0 | draft |
| FEAT-CARD-EDIT-DETAIL | Edit Card Detail | P0 | draft |
| FEAT-CARD-ARCHIVE | Archive Card | P1 | draft |

## Shared Concepts
- Fractional-index `position` ordering (`ADR-003`), same mechanism as `MOD-LIST`.
- Soft-delete via `archived_at` (`ADR-005`).
- `SCR-CARD-DETAIL` is the modal screen hosting this module's detail/archive features plus the label/member/comment/activity features from other modules.

## Dependencies
`MOD-LIST` (a Card always belongs to a List).

## Owners
Frontend Team (board/card UI, drag-and-drop), Backend Team (API/DB, concurrency).
