---
code: REQ-WORKSPACE-002
type: requirement
title: Manage Workspace Members and Roles
status: draft
owner: Product Owner
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [workspace]
related:
  modules: [MOD-WORKSPACE]
  features: [FEAT-WORKSPACE-MANAGE-MEMBERS]
  requirements: []
  business_rules: [BR-WORKSPACE-001, BR-WORKSPACE-002]
  screens: []
  flows: []
  apis: []
  database_objects: []
  tests: [TC-WORKSPACE-MANAGE-MEMBERS-001]
  decisions: []
---

# Requirement

## Statement
A Workspace owner/admin must be able to invite registered users by email, change a member's role, and remove a member.

## Type
Functional

## Actor / Trigger
Workspace owner/admin; triggered from Workspace Settings.

## Expected Behaviour
Only owner/admin can perform these actions; the owner role cannot be removed or demoted by an admin.

## Rationale / Source
Required for team self-service administration.

## Priority
P1

## Acceptance Criteria
- Given an owner/admin and a registered invitee email, when they invite, then the invitee becomes a `member`.
- Given an owner/admin, when they change a member's role to `admin`, then that member gains admin permissions.
- Given an admin, when they attempt to remove or demote the owner, then the request is rejected.

## Dependencies
`FEAT-WORKSPACE-CREATE`

## Related Business Rules
`BR-WORKSPACE-001`, `BR-WORKSPACE-002`

## Verification
`TC-WORKSPACE-MANAGE-MEMBERS-001`
