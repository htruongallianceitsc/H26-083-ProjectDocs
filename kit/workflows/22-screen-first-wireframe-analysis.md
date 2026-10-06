# Workflow 22 — Screen-First Wireframe Analysis

Use only when the team explicitly wants to review a Feature/project through Screens before continuing detailed functional/technical work.

## Goal

```text
Docs -> Screen Contracts -> Wireframes -> Review Gaps -> Canonical Doc Updates -> Rebuild
```

This workflow is optional and does not replace normal Documentation-First authoring.

## Step 1 — Start a focused review session

All screens:

```bash
cd tools
npm run wireframe:start -- --scope all
```

A selected Feature:

```bash
npm run wireframe:start -- --feature FEAT-AUTH-LOGIN
```

Selected Screens:

```bash
npm run wireframe:start -- --screens SCR-AUTH-LOGIN,SCR-AUTH-FORGOT-PASSWORD
```

The session only controls review/validation scope. It does not change canonical docs.

## Step 2 — Build projections

```bash
npm run wireframe:build
```

Outputs:

```text
.project-docs/wireframes/specs/<screen>.json
docs/_generated/wireframes/<screen>.txt
docs/_generated/wireframes/<screen>.ascii.txt
docs/_generated/SCREEN_WIREFRAMES.html
.project-docs/wireframes/report.json
```

The JSON/text model is the semantic projection. ASCII and HTML are renderers over it.

## Step 3 — Review the combined HTML

Open:

```text
docs/_generated/SCREEN_WIREFRAMES.html
```

Review each Screen for:

- purpose / route;
- sections;
- required fields and validation;
- buttons/actions;
- states;
- destination/conditions for navigation;
- Feature/Requirement ownership;
- missing or contradictory behaviour.

Use `TBD` as a useful signal, not something to hide.

## Step 4 — Record gaps

Example:

```bash
npm run wireframe:gap -- \
  --screen SCR-AUTH-LOGIN \
  --kind missing-action \
  --severity high \
  --summary "Forgot Password action is required but not documented"
```

Or use `kit/templates/wireframe-review-gap-template.json` / `kit/prompts/49-wireframe-review-to-documentation.md` for batch review.

Gap proposals live under `.project-docs/wireframes/proposals/` and do not modify canonical docs.

## Step 5 — Update canonical documentation

For each accepted gap, update the correct owner:

- UI composition/action/state/navigation -> Screen.
- user capability -> Feature.
- expected behaviour / acceptance -> Requirement.
- constraint -> Business Rule.
- cross-screen sequence -> Flow.
- technical contract -> API/DB only when independently confirmed.

Then mark the proposal resolved:

```bash
npm run wireframe:resolve -- --proposal WFG-... --status resolved --reviewer "Reviewer" --note "Updated SCR + REQ"
```

## Step 6 — Rebuild and compare

```bash
npm run wireframe:build
npm run wireframe:check
npm run wireframe:status
```

If canonical Screen docs changed after a projection, `wireframe:check` reports stale artifacts until rebuilt.

## Step 7 — Close the optional session

```bash
npm run wireframe:close -- --reviewer "Reviewer"
```

Close only when accepted gaps have been resolved or explicitly waived/rejected.

## Exit criteria

- reviewed Screens have clear fields/actions/states/navigation;
- important `TBD`s have become explicit gaps or accepted unknowns;
- accepted gaps are reflected in canonical docs;
- generated wireframes are current with source hashes;
- wireframe session is closed before treating the screen-first review as complete.
