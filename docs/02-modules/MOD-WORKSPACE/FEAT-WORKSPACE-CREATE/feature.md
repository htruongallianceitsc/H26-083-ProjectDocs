---
code: FEAT-WORKSPACE-CREATE
type: feature
title: Create Workspace
status: draft
owner: Backend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [workspace]
related:
  modules: [MOD-WORKSPACE]
  features: []
  requirements: [REQ-WORKSPACE-001]
  business_rules: []
  screens: [SCR-WORKSPACE-HOME]
  flows: []
  apis: [API-WORKSPACE-CREATE, API-WORKSPACE-LIST]
  database_objects: [DB-WORKSPACE, DB-WORKSPACE-MEMBER]
  tests: [TC-WORKSPACE-CREATE-001]
  decisions: []
---

# Feature Specification

## 1. Overview
An authenticated user creates a new Workspace and becomes its owner.

## 2. Business Goal
Give every team a dedicated container to organize their boards and members, independent of other teams on the same install.

## 3. Actors
Authenticated user.

## 4. Preconditions
User has an account (`FEAT-AUTH-REGISTER`).

## 5. Trigger
First-time onboarding after registration, or the user explicitly clicks "New workspace" from the workspace switcher.

## 6. Main Flow
1. User enters a Workspace name.
2. Client calls `API-WORKSPACE-CREATE`.
3. Server creates the `DB-WORKSPACE` row and inserts the creator as `owner` in `DB-WORKSPACE-MEMBER`, in one transaction.
4. Client navigates to `SCR-WORKSPACE-HOME` for the new workspace (empty state, prompting to create the first board).

## 7. Alternative Flows
User lists their existing workspaces (`API-WORKSPACE-LIST`) via a workspace switcher and picks one instead of creating a new one.

## 8. Error / Exception Flows
Invalid name (empty or >100 chars) -> `400 VALIDATION_ERROR`.

## 9. Business Rules
None specific to creation itself (role rules apply from the moment the workspace exists, `BR-WORKSPACE-001`).

## 10. Screens / Routes
`SCR-WORKSPACE-HOME`

## 11. APIs
`API-WORKSPACE-CREATE`, `API-WORKSPACE-LIST`

## 12. Database Objects
`DB-WORKSPACE`, `DB-WORKSPACE-MEMBER`

## 13. Permissions
None required beyond being authenticated — any user may create a workspace.

## 14. Notifications / External Effects
None.

## 15. Audit / Logging
Standard request logging.

## 16. Acceptance Summary
Any authenticated user can create a workspace and is immediately its owner.

## 17. Edge Cases
A user can belong to and create multiple workspaces.

## 18. Dependencies
`FEAT-AUTH-REGISTER`

## 19. Known Limitations
No workspace deletion/rename-ownership-transfer flow exposed in v1.

## 20. Open Questions
None blocking.
