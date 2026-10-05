---
code: DB-CARD-LABEL
type: database-object
title: Card Label
status: draft
owner: Backend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [database, label, card]
object_name: card_labels
object_type: table
related:
  modules: [MOD-LABEL]
  features: [FEAT-LABEL-ASSIGN]
  requirements: []
  business_rules: []
  screens: []
  flows: []
  apis: [API-LABEL-ASSIGN, API-LABEL-REMOVE]
  database_objects: [DB-CARD, DB-LABEL]
  tests: []
  decisions: []
---

# Database Object

## Purpose
Join table assigning Labels to Cards.

## Object
- Schema: `public`
- Name: `card_labels`
- Type: Table
- Owner Module: `MOD-LABEL`

## Columns

| Column | Type | Null | Default | Description |
|---|---|---:|---|---|
| card_id | uuid | No | - | FK to `cards.id` |
| label_id | uuid | No | - | FK to `labels.id` |
| created_at | timestamptz | No | now() | Audit (assignment date) |

## Primary Key
Composite: `(card_id, label_id)`

## Foreign Keys
- `card_id` -> `cards.id` (`ON DELETE CASCADE`)
- `label_id` -> `labels.id` (`ON DELETE CASCADE`)

## Unique / Check Constraints
Primary key composite already enforces uniqueness of the pair.

## Indexes

| Index | Columns | Unique | Purpose |
|---|---|---:|---|
| card_labels_pkey | card_id, label_id | Yes | Primary key index, doubles as lookup by card |
| card_labels_label_id_idx | label_id | No | Reverse lookup (cards using a label), used when deleting a label |

## Read By
`API-CARD-GET-DETAIL`, `API-BOARD-GET-DETAIL` (label chips per card).

## Written By
`API-LABEL-ASSIGN` (insert), `API-LABEL-REMOVE` (delete).

## Lifecycle / Soft Delete
Hard delete; no history kept beyond `DB-ACTIVITY-LOG` entries.

## Sensitive Data / Retention
None.

## Expected Volume / Growth
A few rows per Card on average.

## Concurrency / Transaction Notes
Composite primary key prevents duplicate concurrent assignment of the same label to the same card.

## Migration / Backfill Notes
Depends on `cards` and `labels`.
