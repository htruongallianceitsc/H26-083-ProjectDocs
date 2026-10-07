# Navigation and Deep-Link Standard

## Default
For greenfield Expo applications, Expo Router is the preferred router. Alternative navigation requires an ADR.

## Rules
- Route files are adapters; do not embed feature business logic.
- Prefer typed routes.
- Every protected route declares authentication guard behavior.
- Every deep-linkable target defines canonical route, parameter validation, invalid/deleted target behavior and fallback destination.
- Push navigation reuses the deep-link/navigation contract rather than inventing a second route mapping.
- Cold, warm and background launch behavior must be defined.
- Do not restore stale navigation into a route no longer authorized for the current session.

## Shared UI
Navigation shells such as headers and bottom tabs should map to canonical `screen-shell` / `ui-component` documentation rather than being duplicated per Screen.
