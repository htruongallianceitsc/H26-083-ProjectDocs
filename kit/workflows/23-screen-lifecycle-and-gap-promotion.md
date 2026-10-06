# Workflow 23 — Screen Lifecycle and Gap Promotion

This workflow extends the optional Screen-first review mode for Screens whose important behaviour is automatic rather than button-driven.

```text
Canonical Screen docs
        |
        v
Screen semantic projection
        |
        +--> User Actions
        +--> Lifecycle Actions
        +--> System Actions
        +--> API Interactions
        |
        v
Human / AI review
        |
        v
Governed gap proposal
        |
        v
Accept gap
        |
        v
Promotion draft (requires authoring)
        |
        v
Exact Feature / Screen / Requirement / Flow / API / Test plan
        |
        v
Explicit apply
        |
        v
Rebuild wireframe + validation
```

## Commands

```bash
npm run wireframe:gap -- --screen SCR-APP-SPLASH --kind startup-flow-gap --severity high --summary "Startup behaviour is missing canonical coverage"
npm run wireframe:resolve -- --proposal WFG-... --status accepted --reviewer "Reviewer"
npm run wireframe:promote -- --proposal WFG-... --preset startup-bootstrap
```

The promote command above creates a **draft promotion plan only**. It is not allowed to guess entity codes or business semantics.

Author the plan (see `kit/templates/wireframe-promotion-template.json`), set `status` to `authored` and `requiresAuthoring` to `false`, then explicitly apply:

```bash
npm run wireframe:promote -- --proposal WFG-... --plan .project-docs/wireframes/promotions/my-authored-plan.json --apply --reviewer "Reviewer"
```

If an entity code already exists, apply fails by default. Use the normal proposal/edit workflow for existing canonical docs; `--overwrite` exists only for an explicitly reviewed replacement.

## Splash / Bootstrap review checklist

- Is the logo/loading state documented?
- Which lifecycle event starts configuration loading?
- Which API is called and why?
- What state is visible during the call?
- What is persisted/evaluated automatically after success?
- Where does success navigate?
- What happens on API error, timeout, offline, or invalid config?
- Is retry/fallback/cached/default behaviour confirmed or still TBD?
- Are success and error paths covered by Requirements, Flow and Tests?
