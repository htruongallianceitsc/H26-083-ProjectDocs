---
uid: 00000000-0000-4000-8000-000000051402
code: UI-CMP-MOBILE-BOTTOM-NAV
revision: 1
type: ui-component
title: Mobile Bottom Navigation
status: approved
owner: Product & Engineering
created_at: 2026-10-06
updated_at: 2026-10-06
last_reviewed_at: 2026-10-06
tags: [shared-ui]
platform: mobile
related:
  features: []
  requirements: []
  business_rules: []
  screens: []
  decisions: []
---

# Mobile Bottom Navigation

## Purpose
Primary navigation shared by main mobile Screens.

## Component Display Profile
| Property | Value | Notes |
|---|---|---|
| Platform | mobile | |
| Kind | bottom-navigation | |
| Layout | row | |
| Default Region | bottom-nav | |

## Slots
| Slot | Required | Repeatable | Allowed Types | Default / Placeholder | Notes |
|---|---:|---:|---|---|---|
| activeItem | true | false | item-key | Home | Screen selects current item |

## Component Elements
| Element ID | Type | Slot | Placeholder / Label | Count | Content / Role | Notes |
|---|---|---|---|---:|---|---|
| primary-tabs | navigation | | Main navigation | 4 | Main Screen destinations | |

## Navigation Items
| Item | Destination | Icon / Role | Notes |
|---|---|---|---|
| Home | SCR-HOME | home | |
| Tasks | SCR-TASK-LIST | task | |
| Projects | SCR-PROJECT-LIST | folder | |
| Profile | SCR-PROFILE | user | |
