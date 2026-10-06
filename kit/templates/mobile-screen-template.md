---
uid: <GENERATE-UUID>
code: <SCR-MOB-XXX>
revision: 1
type: screen
title: <Mobile Screen>
status: draft
owner: <OWNER>
created_at: YYYY-MM-DD
updated_at: YYYY-MM-DD
last_reviewed_at: YYYY-MM-DD
tags: []
platform: mobile
route: <ROUTE>
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
  integrations: []
  nfrs: []
  runbooks: []
  permissions: []
  native_capabilities: []
  deep_links: []
  push_events: []
  local_storage: []
  sync_policies: []
  background_jobs_mobile: []
  analytics_events: []
  feature_flags: []
  device_test_profiles: []
  open_questions: []
  releases: []
---

# Mobile Screen

## Purpose

## Route & Typed Parameters

## Entry Points

## Visual Display Profile

| Property | Value | Notes |
|---|---|---|
| Platform | mobile | |
| Viewport | 390x844 | Use the target device family when known |
| Primary Visible State | Success / Data Ready | Main wireframe canvas state |
| Canvas Mode | application | application / centered-form / full-bleed |
| Density | medium | low / medium / high |

## Shared UI Composition

Use a `screen-shell` for shared app structure such as Header + content + Bottom Navigation. Keep Screen-specific actions and navigation semantics in this Screen document.

### Shared UI Placements

| Region | Instance ID | Shared Component | Notes |
|---|---|---|---|

### Shared UI Overrides

| Target Instance | Slot / Property | Value | Notes |
|---|---|---|---|

Example: `header | title | Home`; `header | rightActions | Search; Notification`; `bottom-tabs | activeItem | Home`.

## Visual Layout Regions

Document only Screen-local regions or explicit overrides of shell regions. A Shell may already provide `header`, `main`, and `bottom-nav`.

| Region ID | Parent | Position | Layout | Size | Purpose / Content | Notes |
|---|---|---|---|---|---|---|
| main | root | main | column | fluid | Primary Screen content | |

## Visible Components

List Screen-local visible components. Shared Header/Bottom Navigation should normally come from the selected Shell instead of being copied here.

| Region | Component ID | Type | Placeholder / Label | Size / Span | Count | Content / Role | Visibility / State | Notes |
|---|---|---|---|---|---:|---|---|---|
| main | page-title | heading | Page title | full | 1 | Current Screen | Success / Data Ready | |

## Hidden / Secondary UI

| UI | Trigger | Type | Description | Related Action / Requirement |
|---|---|---|---|---|

## Layout / Sections

| Order | Region / Section | Component / Content | Visibility / State | Notes |
|---:|---|---|---|---|

## Fields

| Field | Type | Required | Validation | Notes |
|---|---|---:|---|---|

## User Actions

| Action | Control | Behaviour | Destination | Condition | Related Requirement |
|---|---|---|---|---|---|

## Lifecycle Actions

| Event / Trigger | Action | API / Effect | Success | Failure | Related Requirement |
|---|---|---|---|---|---|

## System Actions

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
| Refreshing | | | |
| Success / Data Ready | | | |
| Empty | | | |
| Partial | | | |
| Error | | | |
| Offline | | | |
| Permission | | | |
| Session expired / Maintenance / Disabled | | | |

## Navigation Rules

| Trigger | Destination | Condition | Back Behaviour |
|---|---|---|---|

## Actions & Validation

## Safe Area / Keyboard / Orientation

## Accessibility

## Lifecycle Behaviour

## Network Transition Behaviour

## APIs / Storage / Realtime

## Analytics

## Performance Notes

## Test Matrix

## Open Questions / Mockup Gaps
