---
code: DOC-SCOPE
type: document
title: Product Scope
status: draft
owner: Product Owner
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [scope]
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
  open_questions: [OQ-001, OQ-002, OQ-003, OQ-004, OQ-005, OQ-006]
  releases: []
---

# Product Scope

## In Scope
- **Authentication & Account** (`MOD-AUTH`): register, login/logout, forgot/reset password.
- **Workspace & Membership** (`MOD-WORKSPACE`): create workspace, invite members, manage member roles.
- **Board** (`MOD-BOARD`): create board, manage board settings (title, background, visibility, star), archive board.
- **List** (`MOD-LIST`): create/rename/archive list, reorder lists via drag-and-drop.
- **Card** (`MOD-CARD`): create card, move card via drag-and-drop (within/across lists), edit card detail (description, due date), archive card.
- **Label** (`MOD-LABEL`): manage board labels, assign/remove labels on a card.
- **Card Members** (`MOD-MEMBER`): assign/unassign board members to a card.
- **Comments & Activity** (`MOD-COMMENT`): add/edit/delete comments on a card, automatic activity log per card.

## Out of Scope
- Checklists inside a card as a first-class, separately tracked sub-entity (deferred — see `OQ-004`).
- File attachments on cards (deferred — storage provider undecided, see `OQ-003`).
- Email/push notifications (deferred — provider undecided, see `OQ-005`).
- Global search across boards/cards (deferred — not part of this release).
- Billing/subscription management, multi-tenant data residency, SSO/SAML.
- Native mobile apps (`docs/20-mobile/` is intentionally unused in this phase).
- Public/guest (unauthenticated) board sharing links.

## Future / Deferred
- Checklists on cards, attachments, notifications (in-app + email), global search, native mobile apps, public board sharing, audit export. Tracked in `docs/19-open-items/open-questions.md`.

## Business Boundaries
KanbanFlow organizes *work items* (Cards) inside a *visual board* structure (Board > List > Card). It does not do time tracking, Gantt/roadmap planning, or resource capacity planning.

## System Boundaries
- Frontend: React SPA served as static assets.
- Backend: Node.js REST API plus a WebSocket channel for realtime board updates.
- Database: PostgreSQL, single primary instance for the MVP.
- No external system owns KanbanFlow data; the one external dependency in scope is a transactional email provider for password-reset emails and workspace invite emails (`INT-EMAIL`).

## Dependencies
- Transactional email delivery (`INT-EMAIL`) for `FEAT-AUTH-FORGOT-PASSWORD` and `FEAT-WORKSPACE-MANAGE-MEMBERS` (invite email).

## Acceptance of Scope
Scope is accepted when every module/feature listed above has a corresponding row in `PROJECT_BLUEPRINT.md` and full Feature -> Requirement -> Business Rule -> Screen -> API -> Database -> Test documentation, per `standards/definition-of-ready-done.md`.
