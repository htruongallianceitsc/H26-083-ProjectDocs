---
uid: 00000000-0000-4000-8000-000000051401
code: UI-CMP-MOBILE-HEADER
revision: 1
type: ui-component
title: Mobile Header
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

# Mobile Header

## Purpose
Reusable Header for primary mobile Screens.

## Component Display Profile
| Property | Value | Notes |
|---|---|---|
| Platform | mobile | |
| Kind | header | |
| Layout | row | |
| Default Region | header | |

## Slots
| Slot | Required | Repeatable | Allowed Types | Default / Placeholder | Notes |
|---|---:|---:|---|---|---|
| left | false | false | icon-button, empty | | Back/menu when applicable |
| title | true | false | text | Title | Screen title |
| rightActions | false | true | icon-button, text-button | | Screen-specific actions |

## Component Elements
| Element ID | Type | Slot | Placeholder / Label | Count | Content / Role | Notes |
|---|---|---|---|---:|---|---|
| title | heading | title | Title | 1 | Current Screen | |
| right-actions | button | rightActions | Action | 2 | Optional Screen actions | |
