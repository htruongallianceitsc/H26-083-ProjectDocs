---
code: DOC-GLOSSARY
type: document
title: Glossary
status: draft
owner: Product Owner
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [glossary]
related:
  modules: []
  features: []
  requirements: []
  business_rules: []
  screens: []
  flows: []
  apis: []
  database_objects: []
  tests: []
  decisions: []
  integrations: []
  nfrs: []
  runbooks: []
  permissions: []
  native_capabilities: []
  deep_links: []
  push_events: []
  local_storage: []
  sync_policies: []
  background_jobs_mobile: []
  analytics_events: []
  feature_flags: []
  device_test_profiles: []
  open_questions: []
  releases: []
---

# Glossary

| Term | Definition |
|---|---|
| Workspace | A top-level container that owns one or more Boards and has its own member list and roles. A User can belong to multiple Workspaces. |
| Board | A single kanban board inside a Workspace, made up of ordered Lists. |
| List | A named, ordered column on a Board (e.g. "To Do") that contains ordered Cards. Also called a "stage" or "column". |
| Card | A single work item placed inside a List. Has a title, description, due date, labels, assigned members, comments, and activity history. |
| Card Move | Changing a Card's List and/or position within a List, typically via drag-and-drop. |
| Label | A short, colored tag defined at Board level and assignable to any Card on that Board. |
| Card Member | A Workspace/Board member assigned to a Card, indicating they are responsible for it. |
| Activity Log | An auto-generated, append-only history of notable actions on a Card (created, moved, labeled, commented, archived, etc.). |
| Position (ordering) | A sortable value (see `ADR-003`) used to keep Lists ordered on a Board and Cards ordered within a List without re-writing every row on each reorder. |
| Archive | Soft-delete: the entity is hidden from normal views but retained in the database (see `ADR-005`), as opposed to hard delete. |
| Role | A permission level a User holds within a Workspace: `owner`, `admin`, or `member` (see `docs/01-product/roles-permissions.md`). |
| Realtime sync | WebSocket-based propagation of board changes to all connected clients viewing the same Board (see `ARCH-004`). |
