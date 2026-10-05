---
code: PRJ-KANBAN
type: project
title: KanbanFlow - Project Overview
status: active
owner: Product Owner
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [project, kanban, web]
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

# Project Overview

## Project Types / Technology Stacks
- Project types: `web`, `api`
- Technology stacks: `reactjs` (frontend SPA), `nodejs-api` (backend REST + WebSocket API), `postgresql` (primary database)
- See `PROJECT_BLUEPRINT.md` for the full inventory and `project.profile.json` for the machine-readable profile.

## Problem / Opportunity
Small and mid-size teams need a lightweight, visual way to organize work as cards moving across stages (To Do / In Progress / Done, or any custom workflow) without the overhead of heavyweight project-management suites. KanbanFlow is a Trello-style kanban board web application: teams create Workspaces, Workspaces contain Boards, Boards contain Lists, and Lists contain Cards that users organize primarily through drag-and-drop.

## Business Goal
Deliver a production-grade, multi-user, realtime kanban board product that a team can adopt in minutes: register, create a workspace, invite teammates, create a board, and start organizing work with lists, cards, labels, assignees and comments.

## Target Users
- **Individual contributor** — creates and moves cards, comments, checks off work.
- **Team lead / board owner** — creates boards, manages lists, labels, and board membership, archives completed work.
- **Workspace admin** — manages workspace membership and roles, owns billing/workspace-level settings in the future.

## Success Criteria
- A new user can register, create a workspace, create a board, and create a card in under 2 minutes.
- Card drag-and-drop reorder/move feels instantaneous (optimistic UI, see `FLOW-CARD-MOVE-DRAGDROP`) and reliably persists.
- Multiple users viewing the same board see each other's changes without a manual refresh (realtime sync, see `ARCH-004`).
- Core functional surface (`MOD-AUTH` through `MOD-COMMENT`) has full documentation traceability: Feature -> Requirement -> Business Rule -> Screen -> API -> Database -> Test (see `docs/17-traceability/`).

## High-Level Scope
In scope: authentication/account, workspaces and membership, boards, lists (with reorder), cards (create/move/edit/archive), labels, card members, comments and activity log. See `docs/00-project/product-scope.md` for the authoritative in/out-of-scope boundary.

## Key Stakeholders
See `docs/00-project/stakeholders.md`.

## Known Constraints
- MVP targets a single PostgreSQL database and a single region deployment; no multi-region/multi-tenant data residency requirements yet.
- No native mobile app in this phase (`docs/20-mobile/` intentionally left for a future phase); the web app must be responsive down to tablet width but is not optimized for phone-sized screens in v1.
- No payment/billing module in this phase.

## Assumptions
- Users access the product through evergreen modern browsers (latest two versions of Chrome, Edge, Firefox, Safari); see `NFR-BROWSER-001`.
- A workspace member's email is unique within the system and is the primary way to invite/identify a user.
- Attachment file storage, outbound notification/email delivery, and global search are needed eventually but are not required for the first release — tracked as open questions / future scope.

## Open Questions
See `docs/19-open-items/open-questions.md` for the full, current list (OQ-001 through OQ-006).
