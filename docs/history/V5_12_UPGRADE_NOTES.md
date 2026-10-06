# v5.12 Upgrade Notes — Screen Lifecycle, Startup Bootstrap & Gap Promotion

## Why this version exists

A simple Todo project exposed an important Screen-first gap: a Splash Screen may show only a logo/loading indicator while performing real work such as `onEnter -> GET /config -> save/evaluate config -> navigate`. v5.11 could describe fields/actions/states/navigation well, but its primary Action model still biased review toward visible user controls.

v5.12 makes automatic Screen behaviour explicit and adds a governed path from a reviewed wireframe gap to the larger canonical entity set that the behaviour actually requires.

## 1. Screen contract v1.1

Screen projection now separates:

- **User Actions** — direct user controls;
- **Lifecycle Actions** — `onEnter`, `onResume`, refresh, exit, etc.;
- **System Actions** — automatic save/evaluate/redirect/timer decisions;
- **API Interactions** — trigger + API + purpose + loading/success/failure behaviour.

A Screen with no user actions no longer produces an action-gap warning if lifecycle/system actions are documented.

## 2. Splash / App Bootstrap is a supported analysis pattern

Recommended modelling:

```text
FEAT-APP-STARTUP
    |
SCR-APP-SPLASH
    |
    +-- Lifecycle onEnter
    |       |
    |       v
    |   API-APP-GET-CONFIG
    |       |
    |       +-- success -> save/evaluate -> main Screen
    |       +-- failure -> documented failure state / TBD
    |
FLOW-APP-STARTUP + REQ-* + TEST-*
```

The starter kit does **not** assume retry, cached config, bundled defaults, timeout or blocking behaviour. Those remain Open Questions until confirmed.

## 3. New Screen-first gap kinds

v5.12 adds:

- `missing-screen`;
- `missing-lifecycle-action`;
- `missing-system-action`;
- `missing-api-interaction`;
- `startup-flow-gap`;
- `test-gap`.

Existing field/action/state/navigation/Feature/Requirement/Rule gaps remain supported.

## 4. Authoring-gated gap promotion

After accepting a gap:

```bash
npm run wireframe:promote -- --proposal WFG-... --preset startup-bootstrap
```

This creates a promotion draft under:

```text
.project-docs/wireframes/promotions/
```

The preset only suggests likely entity types and authoring questions. It does not guess canonical codes or hidden business behaviour.

After an agent/reviewer authors an exact plan:

```bash
npm run wireframe:promote -- --proposal WFG-... --plan .project-docs/wireframes/promotions/authored-plan.json --apply --reviewer "Reviewer"
```

The apply step can materialize new Feature, Requirement, Business Rule, Screen, Flow, API and Test Case documents in one reviewed operation.

## 5. Existing entity protection

Promotion apply refuses to replace an existing entity code by default. Existing Screen/Requirement/Flow enrichment should normally use the standard governed edit/proposal path instead of whole-file replacement.

## 6. New reusable assets

- `kit/registry/wireframe-spec.schema.json` -> schema v1.1;
- `kit/registry/wireframe-promotion.schema.json`;
- `kit/registry/wireframe-workflow.json` -> workflow v1.1;
- `kit/templates/screen-template.md` with lifecycle/system/API sections;
- `kit/templates/wireframe-promotion-template.json`;
- `kit/examples/startup-bootstrap-promotion.example.json`;
- `kit/prompts/50-screen-lifecycle-and-gap-promotion.md`;
- `kit/workflows/23-screen-lifecycle-and-gap-promotion.md`.

## Recommended v5.12 loop

```text
Screen docs
   -> build wireframes
   -> inspect user/lifecycle/system/API behaviour
   -> record gap
   -> accept gap
   -> update existing docs OR draft promotion for new entities
   -> author exact semantics
   -> apply explicitly
   -> rebuild
   -> validate / close session
```
