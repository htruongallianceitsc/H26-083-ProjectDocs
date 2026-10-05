---
code: MOD-MEMBER
type: module
title: Card Members
status: draft
owner: Frontend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [member, card]
related:
  modules: []
  features: [FEAT-MEMBER-ASSIGN-CARD]
  requirements: []
  business_rules: []
  screens: []
  flows: []
  apis: []
  database_objects: [DB-CARD-MEMBER]
  tests: []
  decisions: []
---

# Module

## Purpose
Lets board members assign responsibility for a Card to one or more Workspace members.

## Scope
Card-level member assignment only. Workspace membership itself is owned by `MOD-WORKSPACE`.

## Feature Inventory

| Feature Code | Title | Priority | Status |
|---|---|---|---|
| FEAT-MEMBER-ASSIGN-CARD | Assign Card Member | P2 | draft |

## Shared Concepts
Assignable users are exactly the members of the Card's Board's Workspace (`BR-MEMBER-001`).

## Dependencies
`MOD-CARD` (a Card must exist), `MOD-WORKSPACE` (the pool of assignable users).

## Owners
Frontend Team (UI), Backend Team (API/DB).
