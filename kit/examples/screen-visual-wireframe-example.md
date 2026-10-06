# Example — Web Screen Visual Wireframe Specification

The following is an example fragment to copy/adapt into a canonical Screen. It demonstrates the kind of information needed to produce a wireframe similar to a conventional grayscale UX wireframe.

## Visual Display Profile

| Property | Value | Notes |
|---|---|---|
| Platform | web-desktop | |
| Viewport | 1440x900 | Representative review viewport |
| Primary Visible State | Success / Data Ready | |
| Canvas Mode | dashboard | |
| Density | medium | |

## Visual Layout Regions

| Region ID | Parent | Position | Layout | Size | Purpose / Content | Notes |
|---|---|---|---|---|---|---|
| header | root | top | row | full x 64 | Logo, primary navigation, utility actions | |
| sidebar | root | left | column | 220 | Secondary navigation / filters | |
| main | root | main | column | fluid | Primary page content | |
| aside | root | right | column | 280 | Summary/recent items | |

## Visible Components

| Region | Component ID | Type | Placeholder / Label | Size / Span | Count | Content / Role | Visibility / State | Notes |
|---|---|---|---|---|---:|---|---|---|
| header | logo | logo | Product Logo | auto | 1 | Brand anchor | Success / Data Ready | |
| header | primary-nav | tabs | Overview / Tasks / Reports | full | 3 | Main sections | Success / Data Ready | |
| sidebar | filter-nav | navigation | Filters | full | 1 | Filter categories | Success / Data Ready | |
| main | hero | image | Featured image | full | 1 | Main visual/banner | Success / Data Ready | |
| main | section-title | heading | Current Tasks | full | 1 | Main content heading | Success / Data Ready | |
| main | task-cards | card-grid | Task | 4 columns | 8 | Task summaries | Success / Data Ready | |
| aside | stats | stat | Completion | full | 3 | Summary metrics | Success / Data Ready | |
| aside | recent-list | list | Recent Activity | full | 1 | Latest activity | Success / Data Ready | |

## Hidden / Secondary UI

| UI | Trigger | Type | Description | Related Action / Requirement |
|---|---|---|---|---|
| task-actions | Click card menu | popover | Edit / Archive / Delete actions | |
| delete-confirm | Choose Delete | modal | Confirm destructive action | |
