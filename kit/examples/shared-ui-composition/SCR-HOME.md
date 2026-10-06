---
uid: 00000000-0000-4000-8000-000000051404
code: SCR-HOME
revision: 1
type: screen
title: Home
status: approved
owner: Product & Engineering
created_at: 2026-10-06
updated_at: 2026-10-06
last_reviewed_at: 2026-10-06
tags: []
platform: mobile
route: /home
related:
  modules: []
  features: []
  requirements: []
  business_rules: []
  screens: []
  screen_shells: [UI-SHELL-MOBILE-MAIN]
  ui_components: []
  flows: []
  apis: []
  tests: []
  decisions: []
---

# Home

## Purpose
Home dashboard.

## Visual Display Profile
| Property | Value | Notes |
|---|---|---|
| Platform | mobile | |
| Viewport | 390x844 | |
| Primary Visible State | Success / Data Ready | |
| Canvas Mode | application | |
| Density | medium | |

## Shared UI Overrides
| Target Instance | Slot / Property | Value | Notes |
|---|---|---|---|
| header | title | Home | |
| header | rightActions | Search; Notification | Screen-specific actions |
| bottom-tabs | activeItem | Home | |

## Visual Layout Regions
| Region ID | Parent | Position | Layout | Size | Purpose / Content | Notes |
|---|---|---|---|---|---|---|
| main | root | main | column | fluid | Dashboard content | Shell owns header/bottom-nav |

## Visible Components
| Region | Component ID | Type | Placeholder / Label | Size / Span | Count | Content / Role | Visibility / State | Notes |
|---|---|---|---|---|---:|---|---|---|
| main | welcome | heading | Welcome | full | 1 | Dashboard heading | Success / Data Ready | |
| main | summary-cards | card-grid | Summary | full | 4 | Dashboard summary | Success / Data Ready | |

## User Actions
| Action | Control | Behaviour | Destination | Condition | Related Requirement |
|---|---|---|---|---|---|
| Search | Header right button | Open search | SCR-SEARCH | | |
| Notification | Header right button | Open notifications | SCR-NOTIFICATION | | |

## Lifecycle Actions

## System Actions

## API Interactions

## UI States
| State | Trigger | Visible Difference | Allowed Actions |
|---|---|---|---|
| Success / Data Ready | data loaded | dashboard shown | all |

## Navigation Rules
| Trigger | Destination | Condition | Back Behaviour |
|---|---|---|---|
| Tap Tasks tab | SCR-TASK-LIST | | standard |
