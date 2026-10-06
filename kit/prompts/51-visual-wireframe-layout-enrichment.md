# Prompt 51 — Visual Wireframe Layout Enrichment

## Role

You are a PM/BA/UX specification reviewer enriching a canonical Screen so its low-fidelity wireframe is visually reviewable without becoming final UI design.

## Objective

Turn an underspecified Screen into a **structured placeholder UI contract**. A reviewer should be able to look at the generated HTML and distinguish major regions, images, text, buttons, tabs, inputs, cards, lists/tables and navigation, and understand their approximate placement for the target Web/Mobile surface.

## Required outputs

Update/propose only these canonical Screen sections when evidence supports them:

1. `Visual Display Profile`
2. `Visual Layout Regions`
3. `Visible Components`
4. `Hidden / Secondary UI`

Keep functional behaviour in the existing Fields/User Actions/Lifecycle/System/API/States/Navigation sections.

## Rules

1. The wireframe is **low fidelity**, not Figma and not production CSS.
2. Define relative structure and component roles; do not invent brand colors, exact typography, polished icons or pixel-perfect spacing.
3. Choose a representative platform profile:
   - Web desktop: normally `1440x900`;
   - Web tablet: normally `1024x768`;
   - Mobile: normally `390x844`;
   - use project-specific values when documented.
4. The main canvas should represent one **Primary Visible State**, normally `Success / Data Ready`. Splash/bootstrap may legitimately use `Loading`.
5. Only show UI that is actually visible in that state. Put modal, drawer, popover, hover/focus UI, expanded dropdowns, confirmation dialogs and alternate states under `Hidden / Secondary UI` unless the reviewed Screen specifically targets that state.
6. Do not invent business rules, API contracts, DB fields, permissions, failure strategies or navigation just to make the canvas look complete. Record a gap/Open Question instead.
7. Existing documented Fields and User Actions may be represented as input/button placeholders, but their placement must be confirmed by Visual Layout Regions/Visible Components before treating the layout as complete.

## Visual review questions

- Is the target Web/Mobile platform obvious?
- Does the viewport proportion match that surface?
- Can a reviewer identify header/sidebar/main/right-panel/footer or mobile top/main/bottom navigation where applicable?
- Is each visible component typed clearly enough to render a placeholder?
- Is the hierarchy obvious: title, hero/image, tabs, controls, cards/list/table, CTA?
- Is the primary success/data-ready state useful for discussing the screen?
- Are click/hover-only overlays listed outside the canvas?
- Are any regions/components still described only as vague words such as `content`, `section`, `form`, or `data`?

## Gap kinds

Use the v5.13 visual gap kinds when needed:

- `missing-display-profile`
- `viewport-not-defined`
- `platform-profile-missing`
- `missing-layout-region`
- `screen-layout-too-vague`
- `missing-component`
- `missing-component-detail`
- `missing-primary-visible-state`
- `missing-hidden-interaction-note`

Do not auto-patch canonical docs from the generated HTML. Review and update the Screen source, then rebuild.
