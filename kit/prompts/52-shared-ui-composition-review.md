# Prompt 52 — Shared UI Composition Review

Review the selected Screens and decide whether repeated visual structure should be canonical shared UI.

## Tasks

1. Identify repeated visual elements such as Header, Bottom Navigation, Sidebar, common toolbar or persistent app frame.
2. Separate **shared structure** from **Screen-specific behaviour/content**.
3. Propose `ui-component` entities for reusable building blocks.
4. Propose `screen-shell` entities when multiple shared components form one recurring frame.
5. Define slots only for values that Screens legitimately vary, e.g. `title`, `left`, `rightActions`, `activeItem`.
6. Link Screen → Shell and Shell → UI Component through canonical relations.
7. Keep Screen-specific button behaviour in `User Actions`/`Navigation Rules`.
8. Rebuild wireframes and verify ownership/provenance and impact paths.

## Review questions

- Is the element visually/structurally repeated across at least two Screens?
- Would changing it require coordinated changes across Screens if it remained duplicated?
- Is a difference a true variant/slot, or is it actually a different component?
- Does the shared component contain business logic that belongs on a Screen/Feature instead?
- Does every Shell placement also exist in `related.ui_components`?
- Does every Screen override target a declared component slot?
- Are Header right actions represented in Screen `User Actions`?
- Do Bottom Navigation destinations resolve to canonical Screen codes?

## Output

Return proposed canonical documents/changes and the impacted Screens. Do not edit generated wireframe HTML as source of truth.
