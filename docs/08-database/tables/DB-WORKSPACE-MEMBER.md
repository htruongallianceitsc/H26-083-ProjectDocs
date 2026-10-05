---
code: DB-WORKSPACE-MEMBER
type: database-object
title: Workspace Member
status: draft
owner: Backend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [database, workspace]
object_name: workspace_members
object_type: table
related:
  modules: [MOD-WORKSPACE]
  features: [FEAT-WORKSPACE-MANAGE-MEMBERS]
  requirements: []
  business_rules: [BR-WORKSPACE-001, BR-WORKSPACE-002]
  screens: []
  flows: [FLOW-WORKSPACE-INVITE-MEMBER]
  apis: [API-WORKSPACE-INVITE-MEMBER, API-WORKSPACE-UPDATE-MEMBER-ROLE, API-WORKSPACE-REMOVE-MEMBER]
  database_objects: [DB-WORKSPACE, DB-USER]
  tests: []
  decisions: []
---

# Database Object

## Purpose
Join table expressing which Users belong to which Workspace and with what role.

## Object
- Schema: `public`
- Name: `workspace_members`
- Type: Table
- Owner Module: `MOD-WORKSPACE`

## Columns

| Column | Type | Null | Default | Description |
|---|---|---:|---|---|
| id | uuid | No | gen_random_uuid() | Primary key |
| workspace_id | uuid | No | - | FK to `workspaces.id` |
| user_id | uuid | No | - | FK to `users.id` |
| role | text | No | 'member' | One of `owner`, `admin`, `member` |
| invited_email | text | Yes | null | Email the invite was sent to (kept even after acceptance for audit) |
| created_at | timestamptz | No | now() | Audit (join date) |
| updated_at | timestamptz | No | now() | Audit (last role change) |

## Primary Key
`id`

## Foreign Keys
- `workspace_id` -> `workspaces.id`
- `user_id` -> `users.id`

## Unique / Check Constraints
- `UNIQUE (workspace_id, user_id)` — a user appears once per workspace (`BR-WORKSPACE-002`)
- `CHECK (role IN ('owner','admin','member'))`

## Indexes

| Index | Columns | Unique | Purpose |
|---|---|---:|---|
| workspace_members_workspace_id_user_id_key | workspace_id, user_id | Yes | Enforce single membership, fast membership check |
| workspace_members_user_id_idx | user_id | No | "My workspaces" lookup |

## Read By
`API-WORKSPACE-LIST`, `API-BOARD-CREATE`/`API-BOARD-GET-DETAIL` (authorization check), `API-WORKSPACE-INVITE-MEMBER` (duplicate check).

## Written By
`API-WORKSPACE-CREATE` (insert owner row), `API-WORKSPACE-INVITE-MEMBER` (insert), `API-WORKSPACE-UPDATE-MEMBER-ROLE` (update `role`), `API-WORKSPACE-REMOVE-MEMBER` (delete).

## Lifecycle / Soft Delete
Hard delete on removal (`API-WORKSPACE-REMOVE-MEMBER`) — membership itself is not an audit record; the workspace-level `activity_log` concept is out of scope for v1 (card-level activity only, see `DB-ACTIVITY-LOG`).

## Sensitive Data / Retention
`invited_email` is personal data.

## Expected Volume / Growth
Workspace count x average member count (tens to low hundreds per workspace).

## Concurrency / Transaction Notes
The `UNIQUE (workspace_id, user_id)` constraint is the authoritative guard against duplicate invites being accepted twice concurrently.

## Migration / Backfill Notes
Depends on `workspaces` and `users`.
