# v5.11 Upgrade Notes — Screen-First Wireframe Analysis

## Goal

v5.11 adds an **optional Screen-First Analysis Mode** for cases where a PM/BA/product team wants to inspect the project through Screens before going deeper into technical implementation detail.

The intended loop is:

```text
Canonical Docs
  -> Screen semantic projection
  -> Text / ASCII / Combined HTML Wireframe
  -> Human/AI screen review
  -> Gap proposals
  -> Canonical Screen/Feature/Requirement/Rule/Flow updates
  -> Rebuild / re-review
```

This does **not** make wireframes canonical. They remain generated projections.

## Why this is separate from v5.10 Mockup-Driven Documentation

v5.10 works **outside-in**:

```text
Image mockup -> analysis -> Screen docs
```

v5.11 adds the reverse review direction:

```text
Docs -> generated wireframes -> review -> docs enrichment
```

Together they support a controlled round trip without creating duplicate truth:

```text
External Mockup Evidence
        -> Canonical Screen Docs
        -> Generated Wireframe Review
        -> Canonical Docs Enrichment
```

## Format strategy

v5.11 intentionally does not choose only one of ASCII, text or HTML.

### Text-based wireframe / Screen contract — semantic layer

Best for:

- AI analysis;
- Git diff/review;
- deterministic parsing;
- responsive/data-heavy Screens where a fixed visual layout would be misleading.

This is the preferred machine-readable/reviewable projection.

### HTML wireframe — primary human review surface

Best for:

- PM/BA/product walkthrough;
- reviewing many Screens in one place;
- checking actions/navigation/states visually;
- non-technical stakeholders.

v5.11 generates one standalone file:

```text
docs/_generated/SCREEN_WIREFRAMES.html
```

The file includes a searchable Screen sidebar and all in-scope Screens. Known Screen-code destinations become anchor links.

### ASCII mockup — quick convenience output

Best for:

- terminal/chat discussion;
- quick early review;
- one simple Screen at a time.

It is not recommended as the main representation for complex or responsive UI.

## New files

```text
kit/registry/wireframe-workflow.json
kit/registry/wireframe-spec.schema.json
kit/standards/screen-first-wireframe-analysis.md
kit/workflows/22-screen-first-wireframe-analysis.md
kit/prompts/48-documentation-to-screen-wireframes.md
kit/prompts/49-wireframe-review-to-documentation.md
kit/templates/screen-wireframe-contract-template.md
kit/templates/wireframe-review-gap-template.json
tools/lib/wireframes.mjs
tools/scripts/wireframe-tool.mjs
tools/scripts/wireframe-e2e.mjs
```

Runtime state:

```text
.project-docs/wireframes/session.json
.project-docs/wireframes/specs/
.project-docs/wireframes/proposals/
.project-docs/wireframes/report.json
```

Generated review output:

```text
docs/_generated/wireframes/*.txt
docs/_generated/wireframes/*.ascii.txt
docs/_generated/SCREEN_WIREFRAMES.html
```

## New commands

```bash
npm run wireframe:start -- --scope all
npm run wireframe:start -- --feature FEAT-...
npm run wireframe:start -- --module MOD-...
npm run wireframe:start -- --screens SCR-A,SCR-B
npm run wireframe:build
npm run wireframe:gap -- --screen SCR-... --kind missing-action --severity high --summary "..."
npm run wireframe:resolve -- --proposal WFG-... --status accepted --reviewer "Reviewer"
npm run wireframe:resolve -- --proposal WFG-... --status resolved --reviewer "Reviewer"
npm run wireframe:check
npm run wireframe:status
npm run wireframe:close -- --reviewer "Reviewer"
```

## Screen template enrichment

The Screen template is more explicit in v5.11:

- Layout/Sections table;
- Actions table with behaviour, destination, condition and related Requirement;
- UI States table;
- Navigation Rules table.

This makes Screen specs more useful both to humans and to generated wireframe projections.

## Governance decisions

1. The workflow is optional and inactive by default.
2. Generated wireframes are never source of truth.
3. `TBD` remains visible instead of being filled with invented behaviour.
4. Review gaps are stored as proposals first.
5. Accepted gaps must update the correct canonical owner.
6. HTML review does not auto-patch Screen/Feature/Requirement/Rule/Flow docs.
7. An active review session detects stale projections after Screen docs change.
8. Accepted unresolved gaps can block session closure.

## Recommended usage

For a Feature such as Login:

```text
Feature / Requirements / existing Screen docs
        |
        v
wireframe:start --feature FEAT-AUTH-LOGIN
        |
        v
wireframe:build
        |
        v
SCREEN_WIREFRAMES.html
        |
        +--> Missing Forgot Password action
        +--> Undefined Error state
        +--> Login success destination unclear
        |
        v
Gap proposals
        |
        v
Update SCR / REQ / FLOW
        |
        v
wireframe:build -> wireframe:check -> close
```

This is especially useful before implementation planning, UAT preparation, or UX completeness review.
