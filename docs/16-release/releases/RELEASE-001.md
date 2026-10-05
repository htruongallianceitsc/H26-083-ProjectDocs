---
code: RELEASE-001
type: release
title: v1.0 MVP Release
status: draft
owner: Product Owner
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [release, mvp]
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
---

# Release

## Scope
First production release of KanbanFlow covering every module in `PROJECT_BLUEPRINT.md`: Authentication, Workspace & Membership, Board, List, Card, Labels, Card Members, and Comments & Activity.

## Entry Criteria
See `docs/12-devops/release-process.md` Entry Criteria. Blocking item: `OQ-005` (transactional email provider) must be resolved before this release ships, since `FEAT-AUTH-FORGOT-PASSWORD` and `FEAT-WORKSPACE-MANAGE-MEMBERS` depend on `INT-EMAIL`.

## Out of Scope for This Release
Attachments, checklists, notifications, global search, native mobile — per `docs/00-project/product-scope.md` Out of Scope / Future.

## Target Date
TBD — pending resolution of `OQ-005`.

## Rollout Plan
Single-shot full deployment (no feature-flagged gradual rollout in v1); see `docs/12-devops/release-process.md` for the deployment/monitoring/rollback procedure.
