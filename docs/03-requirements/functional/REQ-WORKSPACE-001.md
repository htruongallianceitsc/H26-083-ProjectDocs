---
code: REQ-WORKSPACE-001
type: requirement
title: Create Workspace
status: draft
owner: Product Owner
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [workspace]
related:
  modules: [MOD-WORKSPACE]
  features: [FEAT-WORKSPACE-CREATE]
  requirements: []
  business_rules: []
  screens: []
  flows: []
  apis: []
  database_objects: []
  tests: [TC-WORKSPACE-CREATE-001]
  decisions: []
---

# Requirement

## Statement
Any authenticated user must be able to create a new Workspace and becomes its owner.

## Type
Functional

## Actor / Trigger
Authenticated user; triggered from onboarding or the workspace switcher.

## Expected Behaviour
Creating a Workspace is atomic with granting the creator the `owner` role.

## Rationale / Source
Core multi-tenant boundary for the product.

## Priority
P0

## Acceptance Criteria
- Given an authenticated user, when they submit a valid Workspace name, then the Workspace is created and they are its `owner`.
- Given an authenticated user, when they call list workspaces, then every Workspace they belong to is returned.

## Dependencies
`FEAT-AUTH-REGISTER`

## Related Business Rules
None specific.

## Verification
`TC-WORKSPACE-CREATE-001`
