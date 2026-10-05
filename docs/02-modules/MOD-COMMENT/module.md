---
code: MOD-COMMENT
type: module
title: Comments & Activity
status: draft
owner: Frontend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [comment, activity]
related:
  modules: []
  features: [FEAT-COMMENT-ADD, FEAT-ACTIVITY-LOG]
  requirements: []
  business_rules: []
  screens: []
  flows: []
  apis: []
  database_objects: [DB-COMMENT, DB-ACTIVITY-LOG]
  tests: []
  decisions: []
---

# Module

## Purpose
Owns discussion (Comments) and the automatically generated history (Activity Log) on a Card.

## Scope
Comment CRUD (soft-delete) and the read-only activity feed that every other module's write APIs contribute entries to.

## Feature Inventory

| Feature Code | Title | Priority | Status |
|---|---|---|---|
| FEAT-COMMENT-ADD | Add / Edit / Delete Comment | P1 | draft |
| FEAT-ACTIVITY-LOG | Card Activity Log | P2 | draft |

## Shared Concepts
`DB-ACTIVITY-LOG` is written to by nearly every other module's mutating APIs (card create/move/archive, label assign/remove, member assign/remove, comment add) — this module owns reading it back, not all of its writers.

## Dependencies
`MOD-CARD` (a Card must exist).

## Owners
Frontend Team (UI), Backend Team (API/DB).
