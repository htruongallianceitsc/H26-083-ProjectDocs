# Visual Wireframe Review Guide

v5.13 adds a low-fidelity visual layer to the optional Screen-first workflow. It exists to answer a practical review question: **can a PM/BA/dev look at the generated Screen and understand the real layout/component hierarchy before implementation?**

## Source-of-truth rule

Canonical Screen/Feature/Requirement/Flow docs remain the source of truth. The generated HTML is a projection and must be rebuilt after canonical changes.

## What belongs on the primary canvas

Render one representative Screen state, normally `Success / Data Ready`:

- visible header/sidebar/main/aside/footer or mobile top/main/bottom regions;
- image/logo/avatar placeholders;
- headings and text blocks;
- tabs, search/filter controls and form fields;
- buttons/links;
- cards, lists, tables, charts/stats and navigation.

Do not overlay hover/click-only UI by default.

## What stays outside the canvas

Use `Hidden / Secondary UI` for:

- modal dialogs;
- popovers/context menus;
- hover/focus tooltips;
- expanded dropdowns;
- drawers;
- confirmation screens/alternate UI states not selected as the primary state.

## Web vs Mobile

The renderer uses `Visual Display Profile` to preserve representative aspect ratio. Suggested defaults are 1440x900 for Web desktop and 390x844 for Mobile, but project-specific target viewports should replace these when known.

## When the wireframe is vague

Run an active Screen-first session, record visual gaps, then enrich the canonical Screen using:

- `kit/templates/screen-visual-spec-template.md`;
- `kit/prompts/51-visual-wireframe-layout-enrichment.md`;
- `kit/workflows/24-visual-wireframe-layout-enrichment.md`.

The renderer can safely derive temporary placeholders from documented functional Sections/Fields/User Actions, but this does not count as a complete visual specification.
