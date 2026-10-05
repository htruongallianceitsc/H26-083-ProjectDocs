---
code: MOD-WORKSPACE
type: module
title: Workspace & Membership
status: draft
owner: Backend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [workspace]
related:
  modules: []
  features: [FEAT-WORKSPACE-CREATE, FEAT-WORKSPACE-MANAGE-MEMBERS]
  requirements: []
  business_rules: []
  screens: []
  flows: []
  apis: []
  database_objects: [DB-WORKSPACE, DB-WORKSPACE-MEMBER]
  tests: []
  decisions: []
---

# Module

## Purpose
Owns the Workspace entity — the top-level tenant boundary that groups Boards and has its own membership/role list.

## Scope
Workspace creation and membership management (invite, role change, removal). Does not include Board-level behavior (`MOD-BOARD`) or billing (out of scope).

## Feature Inventory

| Feature Code | Title | Priority | Status |
|---|---|---|---|
| FEAT-WORKSPACE-CREATE | Create Workspace | P0 | draft |
| FEAT-WORKSPACE-MANAGE-MEMBERS | Manage Workspace Members | P1 | draft |

## Shared Concepts
- Role model: `owner` / `admin` / `member`, see `docs/01-product/roles-permissions.md` and `BR-WORKSPACE-001`.
- A Workspace always has exactly one `owner` (its creator by default).

## Dependencies
`MOD-AUTH` (a User must be authenticated to create/join a Workspace).

## Owners
Backend Team.
