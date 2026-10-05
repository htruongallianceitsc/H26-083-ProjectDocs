---
code: DOC-FUNCTIONAL-OVERVIEW
type: document
title: Functional Overview
status: draft
owner: Product Owner
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [functional-overview]
related:
  modules: [MOD-AUTH, MOD-WORKSPACE, MOD-BOARD, MOD-LIST, MOD-CARD, MOD-LABEL, MOD-MEMBER, MOD-COMMENT]
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

# Functional Overview

```mermaid
flowchart TD
  AUTH[MOD-AUTH: Register / Login / Password Reset] --> WORKSPACE[MOD-WORKSPACE: Create / Invite Members]
  WORKSPACE --> BOARD[MOD-BOARD: Create / Manage Board]
  BOARD --> LIST[MOD-LIST: Manage / Reorder Lists]
  LIST --> CARD[MOD-CARD: Create / Move / Edit / Archive Cards]
  CARD --> LABEL[MOD-LABEL: Manage and Assign Labels]
  CARD --> MEMBER[MOD-MEMBER: Assign Card Members]
  CARD --> COMMENT[MOD-COMMENT: Comments and Activity Log]
```

| Module | Purpose |
|---|---|
| `MOD-AUTH` | Account lifecycle: register, login, forgot/reset password. Issues the session (JWT access + refresh token, `ADR-002`) every other module depends on. |
| `MOD-WORKSPACE` | Top-level tenant boundary: create a workspace, invite/manage members and roles. |
| `MOD-BOARD` | Create and manage Boards inside a Workspace (settings, background, visibility, star, archive). |
| `MOD-LIST` | Manage Lists (columns) on a Board, including drag-and-drop reorder. |
| `MOD-CARD` | The core work item: create, drag-and-drop move (within/across Lists), edit detail, archive. |
| `MOD-LABEL` | Board-scoped labels and assigning them to Cards. |
| `MOD-MEMBER` | Assigning Board/Workspace members to individual Cards. |
| `MOD-COMMENT` | Card comments and the automatically generated activity log. |

See `PROJECT_BLUEPRINT.md` for the full Feature/Screen/API/Database inventory per module.
