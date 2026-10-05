---
code: FEAT-WORKSPACE-MANAGE-MEMBERS
type: feature
title: Manage Workspace Members
status: draft
owner: Backend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [workspace]
related:
  modules: [MOD-WORKSPACE]
  features: []
  requirements: [REQ-WORKSPACE-002]
  business_rules: [BR-WORKSPACE-001, BR-WORKSPACE-002]
  screens: [SCR-WORKSPACE-SETTINGS]
  flows: [FLOW-WORKSPACE-INVITE-MEMBER]
  apis: [API-WORKSPACE-INVITE-MEMBER, API-WORKSPACE-UPDATE-MEMBER-ROLE, API-WORKSPACE-REMOVE-MEMBER]
  database_objects: [DB-WORKSPACE-MEMBER]
  tests: [TC-WORKSPACE-MANAGE-MEMBERS-001]
  decisions: []
---

# Feature Specification

## 1. Overview
A Workspace owner/admin invites other registered users by email, changes a member's role, or removes a member.

## 2. Business Goal
Let a team self-manage who has access to their Workspace's boards without external administration.

## 3. Actors
Workspace owner/admin (inviting/removing/changing roles); the invited user (receiving the invite — they must already have an account, see known limitation).

## 4. Preconditions
Workspace exists; actor holds `owner` or `admin` role in it.

## 5. Trigger
Owner/admin opens `SCR-WORKSPACE-SETTINGS`.

## 6. Main Flow
1. Owner/admin enters an email on `SCR-WORKSPACE-SETTINGS` and submits -> `API-WORKSPACE-INVITE-MEMBER`.
2. Server verifies the email matches an existing registered user, inserts a `DB-WORKSPACE-MEMBER` row with role `member`, and sends a notification email via `INT-EMAIL` (`FLOW-WORKSPACE-INVITE-MEMBER`).
3. The new member appears immediately in the member list for the owner/admin, and the Workspace appears for the invited user on their next `API-WORKSPACE-LIST` call.

## 7. Alternative Flows
- Owner/admin changes a member's role via a dropdown -> `API-WORKSPACE-UPDATE-MEMBER-ROLE`.
- Owner/admin removes a member -> `API-WORKSPACE-REMOVE-MEMBER`; the removed user immediately loses access to the workspace's boards.

## 8. Error / Exception Flows
- Invited email has no matching account -> `404 INVITE_USER_NOT_FOUND` ("This person needs to create a KanbanFlow account first.") — known v1 limitation, see below.
- Email already a member -> `409 ALREADY_MEMBER` (`BR-WORKSPACE-002`).
- Non-owner/admin attempts any of these actions -> `403 FORBIDDEN`.
- Admin attempts to remove or demote the owner -> `403 FORBIDDEN` (`BR-WORKSPACE-001`).

## 9. Business Rules
`BR-WORKSPACE-001`, `BR-WORKSPACE-002`

## 10. Screens / Routes
`SCR-WORKSPACE-SETTINGS`

## 11. APIs
`API-WORKSPACE-INVITE-MEMBER`, `API-WORKSPACE-UPDATE-MEMBER-ROLE`, `API-WORKSPACE-REMOVE-MEMBER`

## 12. Database Objects
`DB-WORKSPACE-MEMBER`

## 13. Permissions
`owner` or `admin` role required for all three actions.

## 14. Notifications / External Effects
Invite sends one email via `INT-EMAIL`.

## 15. Audit / Logging
Standard request logging; no workspace-level activity log in v1 (card-level `DB-ACTIVITY-LOG` only).

## 16. Acceptance Summary
Owners/admins can invite, re-role, and remove members, subject to the owner-protection rule.

## 17. Edge Cases
Self-removal: an owner cannot remove themself without first transferring ownership (not yet supported — blocked entirely in v1, see open questions).

## 18. Dependencies
`FEAT-WORKSPACE-CREATE`; invited user must already have a KanbanFlow account (`FEAT-AUTH-REGISTER`).

## 19. Known Limitations
No invite-by-email-for-unregistered-user flow (pending invite) in v1 — the invitee must register first, then be invited. Ownership transfer is not yet supported.

## 20. Open Questions
Ownership transfer and pending-invite-for-unregistered-email are tracked in `docs/19-open-items/open-questions.md`.
