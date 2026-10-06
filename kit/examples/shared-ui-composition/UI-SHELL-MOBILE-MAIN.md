---
uid: 00000000-0000-4000-8000-000000051403
code: UI-SHELL-MOBILE-MAIN
revision: 1
type: screen-shell
title: Mobile Main Shell
status: approved
owner: Product & Engineering
created_at: 2026-10-06
updated_at: 2026-10-06
last_reviewed_at: 2026-10-06
tags: [shared-ui, screen-shell]
platform: mobile
related:
  ui_components: [UI-CMP-MOBILE-HEADER, UI-CMP-MOBILE-BOTTOM-NAV]
  features: []
  decisions: []
---

# Mobile Main Shell

## Purpose
Shared frame for authenticated main Screens.

## Shell Display Profile
| Property | Value | Notes |
|---|---|---|
| Platform | mobile | |
| Viewport | 390x844 | |
| Canvas Mode | application | |
| Density | medium | |

## Shell Layout Regions
| Region ID | Parent | Position | Layout | Size | Purpose / Content | Notes |
|---|---|---|---|---|---|---|
| header | root | top | row | full x 56 | Shared header | |
| main | root | main | column | fluid | Screen content | |
| bottom-nav | root | bottom | row | full x 64 | Shared navigation | |

## Shell Component Placements
| Region | Instance ID | Shared Component | Required | Notes |
|---|---|---|---:|---|
| header | header | UI-CMP-MOBILE-HEADER | true | |
| bottom-nav | bottom-tabs | UI-CMP-MOBILE-BOTTOM-NAV | true | |
