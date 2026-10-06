---
uid: <GENERATE-UUID>
code: <CODE>
revision: 1
type: screen
title: <TITLE>
status: draft
owner: <OWNER>
created_at: YYYY-MM-DD
updated_at: YYYY-MM-DD
last_reviewed_at: YYYY-MM-DD
tags: []
route: </route>
mockup_refs: []
related:
  modules: []
  features: []
  requirements: []
  business_rules: []
  screens: []
  screen_shells: []
  ui_components: []
  flows: []
  apis: []
  database_objects: []
  tests: []
  decisions: []
---

# Screen / Route

## Purpose

## Route

## Accessible Roles

## Entry Points

## Mockup Coverage

| Mockup | State / Variant | Notes |
|---|---|---|

## Visual Display Profile

This section controls the low-fidelity HTML wireframe. Keep it semantic: define the target surface and primary state, not pixel-perfect visual design.

| Property | Value | Notes |
|---|---|---|
| Platform | web-desktop | Allowed examples: `web-desktop`, `web-tablet`, `mobile`, `mobile-large` |
| Viewport | 1440x900 | Use a representative review viewport for the target platform |
| Primary Visible State | Success / Data Ready | The state shown on the main wireframe canvas |
| Canvas Mode | application | Examples: application, centered-form, full-bleed, dashboard |
| Density | medium | low / medium / high |

## Shared UI Composition

Use this only when the Screen consumes reusable UI. `related.screen_shells` selects the reusable frame; `related.ui_components` lists direct shared components used outside that shell.

### Shared UI Placements

Direct shared components not already placed by the shell.

| Region | Instance ID | Shared Component | Notes |
|---|---|---|---|

### Shared UI Overrides

Override only slots declared by the referenced `ui-component`. Use the shell `Instance ID` as the target.

| Target Instance | Slot / Property | Value | Notes |
|---|---|---|---|

## Visual Layout Regions

Define the major visible areas of the primary state. Use relative structure rather than pixel-perfect CSS.

| Region ID | Parent | Position | Layout | Size | Purpose / Content | Notes |
|---|---|---|---|---|---|---|
| header | root | top | row | full x 64 | Global header | |
| main | root | main | column | fluid | Primary screen content | |

Recommended `Position` values: `top`, `left`, `main`, `right`, `bottom`. Recommended `Layout` values: `row`, `column`, `grid`, `stack`.

## Visible Components

List the components that must be visible in the **Primary Visible State**. These are low-fidelity component roles, not final visual styling.

| Region | Component ID | Type | Placeholder / Label | Size / Span | Count | Content / Role | Visibility / State | Notes |
|---|---|---|---|---|---:|---|---|---|
| main | page-title | heading | Page title | full | 1 | Identifies the current screen | Success / Data Ready | |

Common `Type` values: `logo`, `image`, `hero`, `avatar`, `heading`, `text`, `button`, `tabs`, `input`, `search`, `select`, `textarea`, `checkbox`, `radio`, `badge`, `chip`, `card`, `card-grid`, `list`, `table`, `chart`, `stat`, `navigation`, `loading`, `skeleton`, `custom`.

## Hidden / Secondary UI

Do **not** overlay these on the primary wireframe canvas. Record UI that appears only after click/hover/focus or in a secondary state here.

| UI | Trigger | Type | Description | Related Action / Requirement |
|---|---|---|---|---|

## Layout / Sections

This remains the functional section inventory. `Visual Layout Regions` above is the visual composition used by the placeholder renderer.

| Order | Region / Section | Component / Content | Visibility / State | Notes |
|---:|---|---|---|---|

## Fields

| Field | Type | Required | Validation | Notes |
|---|---|---:|---|---|

## User Actions

| Action | Control | Behaviour | Destination | Condition | Related Requirement |
|---|---|---|---|---|---|

## Lifecycle Actions

Use this for work triggered by the Screen lifecycle rather than a user control, for example `onEnter`, `onResume`, `onRefresh`, or `onExit`.

| Event / Trigger | Action | API / Effect | Success | Failure | Related Requirement |
|---|---|---|---|---|---|

## System Actions

Use this for automatic decisions, persistence, config evaluation, timers, background work, or navigation that the system performs without a direct user control.

| Action | Trigger / Owner | Effect | API / Data | Next State / Destination | Related Requirement |
|---|---|---|---|---|---|

## API Interactions

| Trigger | API | Purpose | Loading State | Success | Failure | Related Requirement |
|---|---|---|---|---|---|---|

## Data Sources

## UI States

| State | Trigger | Visible Difference | Allowed Actions |
|---|---|---|---|
| Initial | | | |
| Loading | | | |
| Success / Data Ready | | | |
| Empty | | | |
| Error | | | |
| No Permission | | | |

## Navigation Rules

| Trigger | Destination | Condition | Back Behaviour |
|---|---|---|---|

## Validation & Messages

## Responsive / Accessibility

## Open Questions / Mockup Gaps

## Related Features / Rules / APIs
