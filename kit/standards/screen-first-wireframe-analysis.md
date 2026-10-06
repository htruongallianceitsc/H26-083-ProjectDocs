# Screen-First Wireframe Analysis Standard — v5.14

## Purpose

Provide an **optional analysis mode** when a team wants to reason from Screens first, discover gaps, and then push reviewed findings back into canonical documentation. Wireframes remain derived projections, never a second source of truth.

v5.14 keeps the v5.13 visual placeholder model and adds Shared UI Composition while preserving the v5.12 lifecycle/system behaviour model. The visual layer so a reviewer can understand the target Web/Mobile viewport, layout hierarchy and visible component roles without turning the generated wireframe into final design.

## Core loop

```text
Canonical Docs
  Screen + Feature + Requirement + Flow
                |
                v
        Wireframe Projection
     text + ASCII + combined HTML
                |
                v
          Screen Review
                |
                v
          Gap Proposals
                |
                v
     Accepted Gap Promotion Draft
                |
                v
  Authored canonical entity plan
                |
                v
      Explicit apply / edit
                |
                v
       Rebuild + Re-review
```

## One semantic model, three renderers

| Format | Best for | Priority |
|---|---|---|
| Text-based Screen contract | AI reasoning, Git diff, deterministic semantics | **Canonical projection layer** |
| HTML wireframe | PM/BA/UX review, cross-screen walkthrough | **Primary human review surface** |
| ASCII mockup | Chat/terminal preview | Convenience |

The architecture is **semantic model -> text/ASCII/HTML**, not three independent truths.

## v5.12+ Screen behaviour model

A Screen may have no direct user controls and still have important behaviour. Keep these categories separate:

### User Actions

Direct user interaction such as button click, link, selection, submit or retry.

### Lifecycle Actions

Work triggered by Screen/application lifecycle, for example:

- `onEnter` / initial load;
- `onResume`;
- pull/automatic refresh;
- `onExit` cleanup.

### System Actions

Automatic application behaviour, such as:

- cache/persist data;
- evaluate configuration;
- choose a destination;
- start/stop a timer;
- automatically redirect;
- transform data for the next state.

### API Interactions

Explicit technical interaction linked to a trigger and visible/system state. The Screen document may say **when/why** an API is used; the API document remains the contract for transport details.


## v5.13 visual placeholder model

The primary HTML review surface also projects four visual sections from the canonical Screen:

1. **Visual Display Profile** — platform, representative viewport, primary visible state, canvas mode and density.
2. **Visual Layout Regions** — semantic top/left/main/right/bottom placement and row/column/grid composition.
3. **Visible Components** — typed placeholders such as logo/image/text/button/tabs/input/card/list/table/chart/navigation.
4. **Hidden / Secondary UI** — modal/popover/hover/focus/expanded UI listed outside the primary canvas.

The canvas normally represents `Success / Data Ready`; screens such as Splash may select `Loading`. Components documented for other states are kept outside the primary canvas.

If these sections are missing, the renderer may create temporary placeholders from already documented Sections/Fields/User Actions, but active Screen-first QA reports the visual contract as incomplete until the canonical Screen is enriched.

## Splash / bootstrap example

```text
App Launch
   |
   v
SCR-APP-SPLASH
   |
   +-- Lifecycle: onEnter
   |        |
   |        v
   |   API-APP-GET-CONFIG
   |        |
   |        +-- success -> System Action: save/evaluate config
   |        |                   |
   |        |                   v
   |        |              SCR-TODO-LIST
   |        |
   |        +-- failure -> Config Error / Retry / Fallback / TBD
```

Do not invent the failure strategy. Retry, cache fallback, bundled defaults, timeout and blocking behaviour must be confirmed in canonical Requirements/Rules/Flows or remain Open Questions.

## Source-of-truth boundary

- Screen: visible composition, states, user actions, lifecycle/system triggers and navigation expectations.
- Feature: capability ownership.
- Requirement: expected functional behaviour and acceptance.
- Business Rule: constraints and decision logic.
- Flow: multi-step sequence and branch behaviour.
- API: endpoint/transport contract.
- Test Case: verification evidence.

Generated HTML/ASCII only reflect the current documents.

## Gap promotion

A reviewer may record gaps such as:

- missing Screen;
- missing lifecycle/system action;
- missing API interaction;
- missing startup flow;
- missing state/navigation;
- missing Feature/Requirement/Rule/Test coverage.

Promotion is two-step by default:

1. `wireframe:promote` creates a **draft promotion plan** from an accepted gap. It may suggest entity types and authoring questions but must not guess exact business semantics.
2. A reviewer/agent authors exact codes, titles, relations and content. Only an explicitly authored plan can be applied.

This prevents a visual observation from silently generating invented APIs, retry rules, database contracts or tests.

## Existing canonical entities

Promotion apply must fail when an entity code already exists unless replacement is explicitly requested. For normal enrichment of an existing Screen/Requirement/Flow, use the governed edit/proposal path rather than replacing the file wholesale.

## Optional lifecycle

```text
inactive
  -> start review session
  -> build projections
  -> review Screen contract
  -> record gaps
  -> accept selected gaps
  -> draft/author promotion if new entities are needed
  -> update canonical docs
  -> rebuild until current
  -> close session
```

Normal project QA does not require Screen-first mode. While a session is active, stale projections and accepted unresolved gaps can be blocking findings.

## v5.14 Shared UI Composition

When multiple Screens share common chrome, do not duplicate it in every Screen. Use `ui-component` for reusable building blocks and `screen-shell` for reusable placement. Screen docs own only local content plus slot overrides. The renderer records provenance and shared source hashes so changing a common component invalidates all dependent projections until rebuild. See `shared-ui-composition.md`.
