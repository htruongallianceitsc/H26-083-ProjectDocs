---
uid: <GENERATE-UUID>
code: <UI-CMP-NAME>
revision: 1
type: ui-component
title: <Shared UI Component>
status: draft
owner: <OWNER>
created_at: YYYY-MM-DD
updated_at: YYYY-MM-DD
last_reviewed_at: YYYY-MM-DD
tags: [shared-ui]
platform: mobile
related:
  features: []
  requirements: []
  business_rules: []
  screens: []
  decisions: []
---

# Shared UI Component

## Purpose

Describe one reusable visual building block used by multiple Screens or Screen Shells. Keep business behaviour on the owning Screen unless it is truly global UI behaviour.

## Component Display Profile

| Property | Value | Notes |
|---|---|---|
| Platform | mobile | `mobile`, `web-desktop`, `web-tablet`, `mobile-large`, or `cross-platform` |
| Kind | generic | Recommended: `header`, `bottom-navigation`, `navigation`, `generic` |
| Layout | row | row / column / grid / stack |
| Default Region | main | Where the component is normally placed |

## Slots

Slots are the supported Screen-level override contract. A Screen may override only documented slots.

| Slot | Required | Repeatable | Allowed Types | Default / Placeholder | Notes |
|---|---:|---:|---|---|---|
| title | false | false | text | Title | Example slot |

## Component Elements

| Element ID | Type | Slot | Placeholder / Label | Count | Content / Role | Notes |
|---|---|---|---|---:|---|---|
| title | heading | title | Title | 1 | Main component title | |

## Navigation Items

Use only for shared navigation components. Destinations must reference canonical Screen codes when known.

| Item | Destination | Icon / Role | Notes |
|---|---|---|---|

## Variants

## Accessibility / Responsive Rules

## Behaviour Boundary

Document only behaviour owned globally by this component. Screen-specific actions, permissions, validation, API calls and navigation conditions remain in the Screen contract.

## Change Impact Notes
