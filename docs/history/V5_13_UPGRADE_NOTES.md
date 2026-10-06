# v5.13 Upgrade Notes — Visual Wireframe Layout Enrichment

## Why this version exists

v5.12 made Screen behaviour explicit, but the generated HTML still behaved more like a Screen-contract viewer than a conventional grayscale UX wireframe. A reviewer could know what a Screen did without being able to see the intended hierarchy: where the header/sidebar/main content lived, which block was an image, which were text/card/table/tab/button components, or whether the canvas represented a Web or Mobile surface.

v5.13 adds a **visual placeholder specification** while preserving Documentation-First ownership.

## 1. Platform-aware Display Profile

Canonical Screen docs may now declare:

- target platform (`web-desktop`, `web-tablet`, `mobile`, `mobile-large`);
- representative viewport;
- primary visible state;
- canvas mode;
- density.

The HTML canvas preserves the viewport aspect ratio. When the profile is missing, the renderer may use project/fallback defaults but reports the incompleteness during an active review session.

## 2. Visual Layout Regions

Screens can define semantic regions such as:

```text
header -> top
sidebar -> left
main -> main
aside -> right
footer -> bottom
```

Each region may use row/column/grid/stack layout and a relative size. This is enough for low-fidelity composition review without embedding production CSS in documentation.

## 3. Typed visible component inventory

`Visible Components` identifies low-fidelity roles including logo/image/hero/avatar, heading/text, button/link/tabs, form controls, card-grid/list/table/chart/stat/navigation/loading/skeleton and custom blocks.

The HTML renderer gives these types visibly different placeholder shapes so a reviewer can identify the future Screen structure at a glance.

## 4. Primary-state-only canvas

The primary canvas normally represents `Success / Data Ready`; Splash/bootstrap can explicitly select `Loading`. Components documented for another state are listed outside the main canvas instead of being mixed into the default Screen.

Modal/popover/hover/focus/drawer/expanded UI belongs under `Hidden / Secondary UI` and is rendered in the review panel, not on top of the primary wireframe.

## 5. Safe fallback derivation

For upgraded projects, v5.13 can derive temporary placeholders from already documented Sections, Fields and User Actions. This helps the HTML remain useful immediately, but the projection report keeps warnings until explicit Display Profile / Visual Regions / Visible Components are added to the canonical Screen.

## 6. Visual completeness gaps

New review classifications include:

- `missing-display-profile`;
- `viewport-not-defined`;
- `platform-profile-missing`;
- `missing-layout-region`;
- `screen-layout-too-vague`;
- `missing-component`;
- `missing-component-detail`;
- `missing-primary-visible-state`;
- `missing-hidden-interaction-note`.

These remain optional Screen-first review findings and do not affect projects that do not activate the workflow.

## 7. New reusable assets

- `kit/registry/wireframe-workflow.json` -> v1.2;
- `kit/registry/wireframe-spec.schema.json` -> v1.2;
- updated `screen-template.md` and `screen-wireframe-contract-template.md`;
- `kit/templates/screen-visual-spec-template.md`;
- `kit/prompts/51-visual-wireframe-layout-enrichment.md`;
- `kit/workflows/24-visual-wireframe-layout-enrichment.md`;
- `kit/examples/screen-visual-wireframe-example.md`;
- `docs/guides/visual-wireframe-review.md`.

## Recommended v5.13 loop

```text
Screen docs
   -> wireframe:build
   -> inspect platform-aware placeholder canvas
   -> record visual gap
   -> enrich canonical Display Profile / Regions / Components / Secondary UI
   -> rebuild
   -> review functional + visual completeness together
```
