---
code: FEAT-MEMBER-ASSIGN-CARD
type: feature
title: Assign Card Member
status: draft
owner: Frontend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [member, card]
related:
  modules: [MOD-MEMBER]
  features: []
  requirements: [REQ-MEMBER-001]
  business_rules: [BR-MEMBER-001]
  screens: [SCR-CARD-DETAIL]
  flows: []
  apis: [API-CARD-MEMBER-ASSIGN, API-CARD-MEMBER-REMOVE]
  database_objects: [DB-CARD-MEMBER]
  tests: [TC-MEMBER-ASSIGN-CARD-001]
  decisions: []
---

# Feature Specification

## 1. Overview
Any board member assigns or unassigns one or more Workspace members to a Card from a member picker in the card detail view.

## 2. Business Goal
Make it visually obvious who owns each piece of work by showing avatar chips on card tiles.

## 3. Actors
Any member of the Board's Workspace.

## 4. Preconditions
Card exists and is not archived.

## 5. Trigger
User opens the member picker in `SCR-CARD-DETAIL`.

## 6. Main Flow
1. User opens the member picker, seeing the workspace's member list with checkmarks on those already assigned.
2. User clicks an unchecked member -> `API-CARD-MEMBER-ASSIGN`; the avatar appears on the card immediately (optimistic) and on the card's board tile.
3. User clicks a checked member -> `API-CARD-MEMBER-REMOVE`; the avatar disappears.

## 7. Alternative Flows
None.

## 8. Error / Exception Flows
- Target user is not a workspace member -> `403 USER_NOT_WORKSPACE_MEMBER` (`BR-MEMBER-001`).
- Card archived -> `409 CARD_ARCHIVED` (`BR-CARD-003`).
- Already assigned -> idempotent success (no error).

## 9. Business Rules
`BR-MEMBER-001`

## 10. Screens / Routes
`SCR-CARD-DETAIL`

## 11. APIs
`API-CARD-MEMBER-ASSIGN`, `API-CARD-MEMBER-REMOVE`

## 12. Database Objects
`DB-CARD-MEMBER`

## 13. Permissions
Any Workspace member (no owner/admin restriction).

## 14. Notifications / External Effects
WebSocket `card.member_assigned`/`card.member_removed` event updates other viewers' boards in realtime.

## 15. Audit / Logging
Each assign/remove writes one `DB-ACTIVITY-LOG` row (`action_type = member_assigned` / `member_removed`).

## 16. Acceptance Summary
A board member can assign or unassign any workspace member on a card, visible immediately on the card tile and detail view for all connected viewers.

## 17. Edge Cases
A card can have any number of assigned members (no cap in v1).

## 18. Dependencies
`FEAT-CARD-CREATE`, `FEAT-WORKSPACE-MANAGE-MEMBERS` (pool of assignable users).

## 19. Known Limitations
No "assigned to me" filter/view in v1.

## 20. Open Questions
None blocking.
