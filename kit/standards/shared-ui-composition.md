# Shared UI Composition Standard — v5.14

## Goal

Avoid duplicating common visual structure across Screen documents while preserving Documentation-First ownership and impact traceability.

## Canonical ownership

Three levels are used:

1. **UI Component (`ui-component`)** — reusable visual building block, e.g. mobile Header or Bottom Navigation.
2. **Screen Shell (`screen-shell`)** — reusable frame that places shared components into stable regions.
3. **Screen (`screen`)** — screen-specific content, behaviour, states and slot overrides.

Generated wireframes are projections only.

## Required relation model

- `screen.related.screen_shells` → at most one `screen-shell` for the primary composition.
- `screen.related.ui_components` → direct shared components used outside the shell when needed.
- `screen-shell.related.ui_components` → shared components composed by the shell.

These relations are used by impact analysis. A component change can therefore propagate through its shell to every consuming Screen.

## Slot override rule

A Screen may override only slots declared by the shared component. For example, a shared Header may expose `title`, `left`, and `rightActions`; a Screen may set `title=Projects` and `rightActions=Add Project; Filter` without redefining the Header itself.

## Behaviour boundary

Shared UI documents describe reusable structure and truly global UI behaviour only. Screen-specific actions must remain in `User Actions`, `Navigation Rules`, lifecycle/system sections, or other canonical Screen documentation.

## Wireframe provenance

The v5.14 wireframe projection records whether a visible element is:

- `screen-local`;
- inherited from a `screen-shell`;
- owned by a `ui-component` with Screen slot overrides.

Changing a shared source invalidates dependent generated wireframes until they are rebuilt.

## Recommended mobile main-shell pattern

```text
UI-CMP-MOBILE-HEADER
          \
           > UI-SHELL-MOBILE-MAIN -> SCR-HOME
          /                         -> SCR-TASK-LIST
UI-CMP-MOBILE-BOTTOM-NAV            -> SCR-PROJECT-LIST
```

The Bottom Navigation item set is canonical in the component. Each Screen normally overrides only `activeItem`. The Header structure is canonical in the component; each Screen normally overrides `title`, optional `left`, and `rightActions`.
