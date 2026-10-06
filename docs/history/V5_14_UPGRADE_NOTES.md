# v5.14 Upgrade Notes — Shared UI Composition & Impact-Aware Wireframes

**Version:** 5.14.0  
**Date:** 2026-10-06

## Goal

Make repeated UI such as mobile Header and Bottom Navigation canonical once instead of copying the same visual definition into every Screen.

## Added

- New `ui-component` entity lifecycle.
- New `screen-shell` entity lifecycle.
- Exact relations:
  - `screen.screen_shells -> screen-shell` (max 1 primary shell);
  - `screen.ui_components -> ui-component`;
  - `screen-shell.ui_components -> ui-component`.
- Impact traversal for `screen_shells` and `ui_components`.
- `ui-component-template.md` and `screen-shell-template.md`.
- Canonical shared UI directories under `docs/05-screens/shared/`.
- Shared UI standard, prompt, workflow and complete mobile Header/Bottom Navigation example.
- Screen and Mobile Screen templates with `Shared UI Placements` and `Shared UI Overrides`.
- Mobile Screen template visual contract brought to parity with the general Screen template.

## Wireframe schema 1.3

The generated Screen spec now includes:

- `composition.shell`;
- `composition.sharedInstances`;
- `effectiveVisualRegions`;
- `effectiveVisibleComponents`;
- `sourceDependencies`;
- shared ownership/provenance;
- Screen slot overrides.

The HTML renderer visually composes Shell + Shared Components + Screen-local UI and displays ownership beside the canvas.

## Shared dependency freshness

A generated Screen projection stores hashes of its `screen-shell` and `ui-component` dependencies. When any shared source changes, `wireframe:check` reports `STALE_WIREFRAME_DEPENDENCY` until `wireframe:build` is run again.

## New composition findings

- `SCREEN_SHELL_NOT_FOUND`
- `MULTIPLE_SCREEN_SHELLS`
- `SCREEN_SHELL_PLATFORM_MISMATCH`
- `SHARED_COMPONENT_NOT_FOUND`
- `SHELL_COMPONENT_RELATION_MISSING`
- `SCREEN_COMPONENT_RELATION_MISSING`
- `INVALID_COMPONENT_OVERRIDE`
- `HEADER_ACTION_NOT_DOCUMENTED`
- `BOTTOM_NAV_DESTINATION_NOT_FOUND`

## Backward compatibility

Existing v5.13 Screens remain valid and render as before when they do not reference a Screen Shell or Shared UI Component. Shared UI is opt-in.

## Recommended migration from v5.13

Do not rewrite every Screen immediately. Start with repeated app chrome:

1. Create `UI-CMP-MOBILE-HEADER`.
2. Create `UI-CMP-MOBILE-BOTTOM-NAV`.
3. Create `UI-SHELL-MOBILE-MAIN` that places both.
4. Add `related.screen_shells: [UI-SHELL-MOBILE-MAIN]` to main Screens.
5. Remove duplicated shared Header/Bottom Nav rows from those Screens only after the shell renders correctly.
6. Add per-Screen slot overrides such as title/right actions/active item.
7. Rebuild and review the wireframes.
