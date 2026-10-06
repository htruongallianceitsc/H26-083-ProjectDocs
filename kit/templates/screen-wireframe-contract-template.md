# Screen Visual Wireframe Contract

This file describes the derived semantic model rendered by v5.14. The canonical Screen document remains the source of truth. The HTML renderer is intentionally low-fidelity: it shows layout, component roles and hierarchy as placeholders rather than final design.

## Identity

- Screen: `SCR-...`
- Route: `/...`
- Purpose: ...
- Related Feature(s): ...
- Related Requirement(s): ...

## Shared UI Composition

- Screen Shell: `<UI-SHELL-... | none>`
- Shared component instances: `<instance -> UI-CMP-...>`
- Overrides: `<instance.slot=value>`
- Provenance: `screen-local | screen-shell | shared-component`

## Visual Display Profile

| Property | Value |
|---|---|
| Platform | `web-desktop` / `web-tablet` / `mobile` / `mobile-large` |
| Viewport | `1440x900` / `390x844` / ... |
| Primary Visible State | `Success / Data Ready` |
| Canvas Mode | application / centered-form / dashboard / ... |
| Density | low / medium / high |

## Visual Layout Regions

| Region ID | Parent | Position | Layout | Size | Purpose / Content |
|---|---|---|---|---|---|

## Visible Components

| Region | Component ID | Type | Placeholder / Label | Size / Span | Count | Content / Role | Visibility / State |
|---|---|---|---|---|---:|---|---|

The HTML renderer understands semantic placeholder types such as image, heading, text, button, tabs, input, card-grid, list, table, chart, stat and navigation. Unknown/custom types render as labelled blocks.

## Hidden / Secondary UI

| UI | Trigger | Type | Description | Related Action / Requirement |
|---|---|---|---|---|

Keep modal/popover/hover-only/dropdown-expanded UI outside the primary canvas unless the reviewed Screen state specifically targets that secondary state.

## Functional Sections

| Order | Region | Content / Component | Visibility / State | Notes |
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

## UI States

| State | Trigger | Visible Difference | Allowed Actions |
|---|---|---|---|

## Navigation

| Trigger | Destination | Condition | Back Behaviour |
|---|---|---|---|

## Gaps / TBD

- ...
