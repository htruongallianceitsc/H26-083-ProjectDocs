# Workflow 25 — Shared UI Composition

## Goal

Turn repeated Screen chrome into canonical reusable UI while preserving Screen-owned behaviour.

## Steps

1. Build/review current Screen wireframes.
2. Identify repeated regions/components.
3. Create/review `ui-component` documents with stable slots.
4. Create/review a `screen-shell` when the same placement recurs.
5. Add `screen.related.screen_shells` and optional direct `screen.related.ui_components`.
6. Add Screen `Shared UI Overrides` only for declared slots.
7. Keep User/Lifecycle/System/API actions on the Screen.
8. Run registry/docs validation and impact analysis.
9. Rebuild wireframes.
10. Verify shared ownership badges, active tab/header differences, navigation destinations and stale-dependency behaviour.

## Exit criteria

- No unnecessary duplicated Header/Bottom Navigation structure across consuming Screens.
- Every shared placement resolves to a canonical `ui-component`.
- Shell/component relations support Component → Shell → Screen impact traversal.
- Screen overrides use declared slots only.
- Shared changes make dependent wireframe projections stale until rebuild.
