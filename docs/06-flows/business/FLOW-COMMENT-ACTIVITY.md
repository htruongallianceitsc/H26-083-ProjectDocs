---
code: FLOW-COMMENT-ACTIVITY
type: flow
title: Comment Creation Triggers Activity Log Entry
status: draft
owner: Backend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [comment, activity, flow, business]
related:
  modules: [MOD-COMMENT]
  features: [FEAT-COMMENT-ADD, FEAT-ACTIVITY-LOG]
  requirements: []
  business_rules: []
  screens: [SCR-CARD-DETAIL]
  flows: []
  apis: [API-COMMENT-CREATE, API-ACTIVITY-LIST]
  database_objects: [DB-COMMENT, DB-ACTIVITY-LOG]
  tests: [TC-COMMENT-ADD-001, TC-ACTIVITY-LOG-001]
  decisions: []
---

# Flow

## Purpose
Show how posting a comment atomically produces both the comment itself and its corresponding activity-log entry, and how that entry reaches other viewers.

## Actors / Systems
Workspace member, Node.js API, PostgreSQL, WebSocket broadcaster.

## Preconditions
Card exists and is not archived.

## Flow Diagram

```mermaid
flowchart TD
  A[User submits comment] --> B[API-COMMENT-CREATE]
  B --> C[BEGIN transaction]
  C --> D[INSERT into comments]
  D --> E[INSERT into activity_log action_type=comment_added]
  E --> F[COMMIT]
  F --> G[Publish comment.created WebSocket event]
  G --> H[Other viewers' comment thread and activity feed update]
```

## Step Details

| Step | Actor/System | Action | Rule/API/Screen | Result |
|---|---|---|---|---|
| 1 | User | Submits a comment | SCR-CARD-DETAIL | Request sent |
| 2 | API | Inserts comment + activity row in one transaction | API-COMMENT-CREATE, DB-COMMENT, DB-ACTIVITY-LOG | Both rows committed together |
| 3 | Broadcaster | Publishes event | ARCH-004 | Other viewers notified |
| 4 | Other clients | Append to thread and feed | FEAT-ACTIVITY-LOG, API-ACTIVITY-LIST | Synced view |

## Error / Retry Paths
If the transaction fails (e.g. database error), neither the comment nor the activity entry is persisted — they are never allowed to diverge.

## End States
Comment visible in the thread; exactly one new activity-log entry visible in the feed, for every viewer.
