---
code: MOD-BOARD
type: module
title: Board Management
status: draft
owner: Frontend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [board]
related:
  modules: []
  features: [FEAT-BOARD-CREATE, FEAT-BOARD-MANAGE]
  requirements: []
  business_rules: []
  screens: []
  flows: []
  apis: []
  database_objects: [DB-BOARD]
  tests: []
  decisions: [ADR-005]
---

# Module

## Purpose
Owns the Board entity — a single kanban board inside a Workspace, and the main screen (`SCR-BOARD`) where Lists and Cards are viewed and manipulated.

## Scope
Board creation and board-level settings (title, background, visibility, star, archive). List/Card behavior inside a board belongs to `MOD-LIST`/`MOD-CARD`.

## Feature Inventory

| Feature Code | Title | Priority | Status |
|---|---|---|---|
| FEAT-BOARD-CREATE | Create Board | P0 | draft |
| FEAT-BOARD-MANAGE | Manage Board Settings | P1 | draft |

## Shared Concepts
- A Board belongs to exactly one Workspace.
- Board access is derived from Workspace membership in v1 (no separate per-board ACL); see `docs/01-product/roles-permissions.md`.

## Dependencies
`MOD-WORKSPACE` (a Workspace must exist first).

## Owners
Frontend Team (board UI), Backend Team (API/DB).
