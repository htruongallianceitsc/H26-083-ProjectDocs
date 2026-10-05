---
code: MOD-LIST
type: module
title: List Management
status: draft
owner: Frontend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [list]
related:
  modules: []
  features: [FEAT-LIST-MANAGE, FEAT-LIST-REORDER]
  requirements: []
  business_rules: []
  screens: []
  flows: []
  apis: []
  database_objects: [DB-LIST]
  tests: []
  decisions: [ADR-003]
---

# Module

## Purpose
Owns Lists — the named, ordered columns on a Board that contain Cards — including creating/renaming/archiving them and reordering them via drag-and-drop.

## Scope
List CRUD and ordering. Card behavior inside a list belongs to `MOD-CARD`.

## Feature Inventory

| Feature Code | Title | Priority | Status |
|---|---|---|---|
| FEAT-LIST-MANAGE | Manage Lists | P0 | draft |
| FEAT-LIST-REORDER | Reorder Lists (drag-and-drop) | P1 | draft |

## Shared Concepts
- Fractional-index `position` ordering (`ADR-003`), shared mechanism with Card ordering (`DB-CARD.position`).
- Lists render on `SCR-BOARD` (owned by `MOD-BOARD`).

## Dependencies
`MOD-BOARD` (a Board must exist first).

## Owners
Frontend Team (drag-and-drop UI), Backend Team (ordering API/DB).
