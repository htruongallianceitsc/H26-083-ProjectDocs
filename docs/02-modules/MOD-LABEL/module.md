---
code: MOD-LABEL
type: module
title: Labels
status: draft
owner: Frontend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [label, board]
related:
  modules: []
  features: [FEAT-LABEL-MANAGE, FEAT-LABEL-ASSIGN]
  requirements: []
  business_rules: []
  screens: []
  flows: []
  apis: []
  database_objects: [DB-LABEL, DB-CARD-LABEL]
  tests: []
  decisions: []
---

# Module

## Purpose
Lets a Board owner/admin define a palette of colored labels and lets any board member tag Cards with them, giving a fast visual categorization (e.g. Bug, Feature, Urgent) across the board without opening every card.

## Scope
Board-scoped label definitions (create/edit/delete) and per-card label assignment (assign/remove). Labels do not span across boards; each Board has its own independent label palette.

## Feature Inventory

| Feature Code | Title | Priority | Status |
|---|---|---|---|
| FEAT-LABEL-MANAGE | Manage Board Labels | P1 | draft |
| FEAT-LABEL-ASSIGN | Assign Label to Card | P1 | draft |

## Shared Concepts
- A Label belongs to exactly one Board (`DB-LABEL.board_id`).
- `DB-CARD-LABEL` is the join table recording which Labels are on which Cards.
- Label chips are rendered both on the card tile (board view) and in the card detail view.

## Dependencies
- `MOD-BOARD` (a Board must exist before labels can be created; label management UI lives on `SCR-BOARD-SETTINGS`).
- `MOD-CARD` (labels are assigned on `SCR-CARD-DETAIL`, owned by `MOD-CARD`).

## Owners
Frontend Team (UI), Backend Team (API/DB).
