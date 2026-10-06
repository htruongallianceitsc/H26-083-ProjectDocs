---
uid: <GENERATE-UUID>
code: <UI-SHELL-NAME>
revision: 1
type: screen-shell
title: <Screen Shell>
status: draft
owner: <OWNER>
created_at: YYYY-MM-DD
updated_at: YYYY-MM-DD
last_reviewed_at: YYYY-MM-DD
tags: [shared-ui, screen-shell]
platform: mobile
related:
  ui_components: []
  features: []
  decisions: []
---

# Screen Shell

## Purpose

Define the shared structural frame used by a group of Screens, for example a mobile main shell with Header + content + Bottom Navigation.

## Shell Display Profile

| Property | Value | Notes |
|---|---|---|
| Platform | mobile | |
| Viewport | 390x844 | Representative review viewport |
| Canvas Mode | application | |
| Density | medium | |

## Shell Layout Regions

| Region ID | Parent | Position | Layout | Size | Purpose / Content | Notes |
|---|---|---|---|---|---|---|
| header | root | top | row | full x 56 | Shared application header | |
| main | root | main | column | fluid | Screen-owned content | |
| bottom-nav | root | bottom | row | full x 64 | Shared primary navigation | |

## Shell Component Placements

Every `Shared Component` should also be listed in `related.ui_components` so graph impact can resolve Component → Shell → Screen.

| Region | Instance ID | Shared Component | Required | Notes |
|---|---|---|---:|---|
| header | header | UI-CMP-MOBILE-HEADER | true | |
| bottom-nav | bottom-tabs | UI-CMP-MOBILE-BOTTOM-NAV | true | |

## Shell Rules

- Screen-specific content belongs in the `main` region unless explicitly documented otherwise.
- Screens may override only slots exposed by the referenced Shared UI Component.
- A Screen-specific override must not silently redefine the shared component structure.

## Responsive / Platform Rules

## Change Impact Notes
