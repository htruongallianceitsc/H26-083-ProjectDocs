# Workflow 24 — Visual Wireframe Layout Enrichment

Use when `SCREEN_WIREFRAMES.html` is functionally correct but visually too vague to understand a Screen's real structure.

```text
Canonical Screen
      |
      v
wireframe:build
      |
      v
Platform-aware placeholder canvas
      |
      v
Visual review gaps
      |
      v
Enrich Display Profile / Regions / Components / Secondary UI
      |
      v
Rebuild -> review again
```

## 1. Start a focused session

```bash
cd tools
npm run wireframe:start -- --screens SCR-TODO-LIST
npm run wireframe:build
```

Open `docs/_generated/SCREEN_WIREFRAMES.html`.

## 2. Review the primary canvas

The canvas intentionally renders one state, normally **Success / Data Ready**. Check that you can visually distinguish:

- global/top navigation;
- sidebar or bottom navigation;
- title/header area;
- image/hero/avatar placeholders;
- tabs/filters/search;
- form fields;
- buttons/links;
- cards/list/table/chart/stat blocks;
- main/aside/footer placement.

Do not expect modal/popover/hover-only UI on this canvas.

## 3. If too vague, record a gap

```bash
npm run wireframe:gap -- \
  --screen SCR-TODO-LIST \
  --kind screen-layout-too-vague \
  --severity warning \
  --summary "Todo List does not define regions/component placement clearly enough for visual review"
```

Other useful kinds: `missing-display-profile`, `missing-layout-region`, `missing-component`, `missing-component-detail`, `missing-primary-visible-state`.

## 4. Enrich the canonical Screen

Use `kit/templates/screen-visual-spec-template.md` and `kit/prompts/51-visual-wireframe-layout-enrichment.md`.

Minimum useful Screen visual contract:

```text
Visual Display Profile
  -> platform + viewport + primary state
Visual Layout Regions
  -> header / sidebar / main / aside / footer (only what exists)
Visible Components
  -> typed placeholder components assigned to regions
Hidden / Secondary UI
  -> modal / popover / hover / expanded UI notes
```

This is not final design. Use relative layout (`top`, `left`, `main`, `right`, `bottom`; `row`, `column`, `grid`) instead of production CSS.

## 5. Rebuild and review

```bash
npm run wireframe:build
npm run wireframe:check
```

The HTML renderer uses platform-aware aspect ratios and typed placeholders. If the canonical visual contract is still absent, it may derive safe placeholders from documented Sections/Fields/User Actions, but the report keeps the corresponding visual-completeness warnings visible.

## 6. Resolve the gap

After the Screen source is genuinely updated:

```bash
npm run wireframe:resolve -- --proposal WFG-... --status resolved --reviewer "Reviewer" --note "Visual regions/components documented"
npm run wireframe:build
```

## Exit criteria

- target platform and viewport are explicit;
- primary state is explicit;
- major visible layout regions are named and positioned;
- visible components have recognizable semantic types;
- click/hover-only secondary UI is documented outside the primary canvas;
- no important region is merely `content`/`section` without enough detail to review;
- generated HTML is current with the canonical Screen hash.
