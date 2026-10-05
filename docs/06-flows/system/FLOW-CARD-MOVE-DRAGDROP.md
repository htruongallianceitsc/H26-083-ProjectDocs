---
code: FLOW-CARD-MOVE-DRAGDROP
type: flow
title: Card Drag-and-Drop Move (Optimistic UI + Realtime Sync)
status: draft
owner: Engineering Lead
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [card, flow, system, drag-and-drop, realtime]
related:
  modules: [MOD-CARD]
  features: [FEAT-CARD-MOVE]
  requirements: [REQ-CARD-002]
  business_rules: [BR-CARD-001, BR-LIST-002]
  screens: [SCR-BOARD]
  flows: []
  apis: [API-CARD-MOVE]
  database_objects: [DB-CARD, DB-ACTIVITY-LOG]
  tests: [TC-CARD-MOVE-001, TC-CARD-MOVE-002]
  decisions: [ADR-003, ADR-004]
---

# Flow

## Purpose
This is the single most important flow in the product: it shows exactly how a drag-and-drop card move goes from a user's pointer gesture to a persisted, conflict-checked database write and out to every other connected viewer in realtime.

## Actors / Systems
User A (dragging the card), User A's SPA, Node.js API, PostgreSQL, WebSocket broadcaster, User B's SPA (another viewer of the same board).

## Preconditions
Card, source list, and target list belong to the same non-archived Board; target list is not archived. User A and User B are both members of the Board's Workspace and have `SCR-BOARD` open with an active WebSocket subscription.

## Flow Diagram

```mermaid
sequenceDiagram
  participant UA as User A
  participant SpaA as User A's SPA
  participant API as Node.js API
  participant DB as PostgreSQL
  participant WS as WebSocket Broadcaster
  participant SpaB as User B's SPA

  UA->>SpaA: Drag card, drop in target list
  SpaA->>SpaA: Optimistically move card tile in local state
  SpaA->>API: PATCH /api/cards/{id}/move (targetListId, anchors, updatedAt)
  API->>DB: BEGIN transaction
  API->>DB: SELECT card WHERE id = ... FOR UPDATE
  alt updatedAt mismatch
    API->>DB: ROLLBACK
    API-->>SpaA: 409 CARD_MOVE_CONFLICT (current card state)
    SpaA->>SpaA: Discard optimistic move, re-render at server state
    SpaA-->>UA: Toast: "This card was moved by someone else"
  else updatedAt matches
    API->>DB: Compute new fractional position (rebalance if needed)
    API->>DB: UPDATE card SET list_id, board_id, position, updated_at
    API->>DB: INSERT activity_log (action_type=card_moved)
    API->>DB: COMMIT
    API-->>SpaA: 200 OK (new position, updatedAt)
    API->>WS: Publish card.moved event
    WS->>SpaB: Deliver card.moved event
    SpaB->>SpaB: Apply move to local state
    SpaB-->>UA: (no direct effect; User B's board now shows the move)
  end
```

## Step Details

| Step | Actor/System | Action | Rule/API/Screen | Result |
|---|---|---|---|---|
| 1 | User A | Drags and drops a card | SCR-BOARD | Gesture captured |
| 2 | SPA A | Renders optimistic move | FEAT-CARD-MOVE | Instant visual feedback |
| 3 | API | Checks concurrency token | BR-CARD-001 | Conflict or proceed |
| 4 | API | Computes position, writes, logs | BR-LIST-002, API-CARD-MOVE, DB-CARD, DB-ACTIVITY-LOG | Move committed |
| 5 | Broadcaster | Publishes event | ARCH-004 | Other clients notified |
| 6 | SPA B | Applies remote update | SCR-BOARD | Synced view for User B |

## Error / Retry Paths
On `CARD_MOVE_CONFLICT`, the client does not automatically retry the original move — it reconciles to the authoritative state returned in the error body and lets the user re-attempt the drag if they still want their intended outcome.

## End States
**Success**: card is in its new list/position for every connected viewer, with one new `activity_log` entry. **Conflict**: card remains at whatever state the winning concurrent request produced; User A's client is reconciled to match.
