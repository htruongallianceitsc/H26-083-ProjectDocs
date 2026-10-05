# v5.2 Upgrade Notes — Progressive Specification

## Goal

Add a Lightweight documentation mode for mock/POC/prototype and low-risk work without creating a parallel documentation model or losing the path to production-grade detail later.

## Compatibility principle

v5.2 keeps `standard` as the project default. A v5.1 project therefore retains its existing Ready/Done expectations unless the project or an individual Feature explicitly selects another level.

Feature identity is stable across promotion. `FEAT-X` remains `FEAT-X`; only its specification depth and extracted canonical relations evolve.

## New specification dimensions

Feature frontmatter may define:

```yaml
spec_level: lightweight | standard | full | auto
target_maturity: concept | prototype | uat | production
```

Project defaults live under `project.profile.json.documentation`.

## Canonical policy

Added `registry/spec-profiles.json` with:

- Lightweight / Standard / Full profiles;
- maturity minimum recommendations;
- risk escalation terms and minimum levels;
- profile-specific Ready relation requirements;
- Full profile section/NFR requirements.

A generated YAML mirror is managed by `registry:sync` and checked by `registry:check`.

## Lightweight profile

Lightweight requires minimum viable Feature content:

- Goal;
- Actors;
- Main Flow;
- Key Rules;
- Acceptance.

It intentionally does not require separate Requirement/Test entities by default.

Added `templates/lightweight-feature-template.md`.

## Mode-aware gates and quality

Ready/Done now evaluate the Feature's effective spec profile.

Existing `feature-requirement` and `feature-test` quality rules now declare `minSpecLevel: standard`, preventing false warnings for legitimate Lightweight Features.

## Risk / maturity recommendation

`auto` resolves to the recommended effective level. Explicit levels below recommendation remain visible and are controlled by:

```json
"riskEscalation": "warn" | "block" | "off"
```

Starter default is `warn` for backward-friendly adoption.

## Promotion workflow

New commands:

```bash
npm run spec:status
npm run spec:check -- --feature FEAT-X
npm run spec:recommend -- --feature FEAT-X
npm run spec:promote -- --feature FEAT-X --to standard
npm run spec:promote -- --feature FEAT-X --to standard --apply
```

Promotion generates a gap report under `.project-docs/spec-promotions/`. `--apply` is blocked until target-level gaps are resolved. The tool never auto-generates product facts to satisfy gaps.

## WorkPlan v1.1

New WorkPlans use schema 1.1 and snapshot:

- effective spec level;
- requested spec level;
- target maturity;
- recommended level;
- risk assessment.

Validator remains backward-compatible with WorkPlan schema 1.0.

## Static site

Added `Spec Levels` page with Feature-level requested/effective level, maturity, recommendation, completeness and escalation indicator.

## New standards / workflows / prompts

- `standards/progressive-specification.md`
- `workflows/16-progressive-specification.md`
- `prompts/38-spec-level-selection.md`
- `prompts/39-lightweight-spec-authoring.md`
- `prompts/40-spec-promotion-review.md`

## Deferred to v6

Source/Git/OpenAPI/database/test-code intelligence remains out of scope for v5.2.
