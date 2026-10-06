# Screen Visual Enrichment Template

Use this template when a generated wireframe is too vague to review. Copy the relevant sections into the canonical Screen document; do not maintain this file as a second source of truth.

## Visual Display Profile

| Property | Value | Notes |
|---|---|---|
| Platform | web-desktop | |
| Viewport | 1440x900 | |
| Primary Visible State | Success / Data Ready | |
| Canvas Mode | application | |
| Density | medium | |

## Visual Layout Regions

| Region ID | Parent | Position | Layout | Size | Purpose / Content | Notes |
|---|---|---|---|---|---|---|
| header | root | top | row | full x 64 | | |
| sidebar | root | left | column | 240 | | |
| main | root | main | column | fluid | | |
| aside | root | right | column | 280 | | |

Delete regions that do not exist. A simple mobile screen may only need `header`, `main`, and `bottom-nav`.

## Visible Components

| Region | Component ID | Type | Placeholder / Label | Size / Span | Count | Content / Role | Visibility / State | Notes |
|---|---|---|---|---|---:|---|---|---|
| main | title | heading | Page title | full | 1 | | Success / Data Ready | |
| main | hero | image | Image | full | 1 | | Success / Data Ready | |
| main | tabs | tabs | Tab A / Tab B / Tab C | full | 3 | | Success / Data Ready | |
| main | cards | card-grid | Item card | 3 columns | 6 | | Success / Data Ready | |
| main | primary-action | button | Primary action | auto | 1 | | Success / Data Ready | |

## Hidden / Secondary UI

| UI | Trigger | Type | Description | Related Action / Requirement |
|---|---|---|---|---|
| item-actions | Click row/card actions | popover | Secondary actions for an item | |
| delete-confirm | Click Delete | modal | Confirmation before deletion | |
