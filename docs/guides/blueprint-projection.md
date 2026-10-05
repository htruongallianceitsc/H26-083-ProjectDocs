# Blueprint Projection Guide

## Why this exists

Large documentation sets are useful for traceability but expensive to author and expensive for humans/AI to load all at once. v5.9 lets a project begin from one `PROJECT_BLUEPRINT.md`, progressively split detail into canonical documents, and later compile the current graph back into one Blueprint at the desired level.

## Two directions

### Blueprint → documents

```bash
cd tools
npm run blueprint:init
npm run blueprint:expand -- --profile standard
npm run blueprint:status
npm run blueprint:review -- --candidate BP-... --decision accepted --reviewer "Reviewer"
npm run blueprint:promote -- --candidate BP-... --reviewer "Reviewer"
```

`expand` only creates candidates under `.project-docs/blueprint/`. Promotion requires review and creates canonical typed Markdown under `docs/`.

### Documents → Blueprint

```bash
npm run blueprint:compile -- --profile standard --audience general
npm run blueprint:render -- --profile overview --audience business
npm run blueprint:render -- --profile standard --audience developer
npm run blueprint:render -- --profile standard --audience qa
```

`compile` refreshes only the managed block in `PROJECT_BLUEPRINT.md`. `render` writes derived standalone projections under `.project-docs/blueprint/rendered/`.

## Ownership

| State | Canonical source | Editing rule |
|---|---|---|
| inline | `PROJECT_BLUEPRINT.md` seed | edit Blueprint |
| linked | detailed Markdown under `docs/` | edit linked document |
| generated | compiled/rendered projection | rebuild, do not hand edit |

## Detail levels

- `overview`: Applications, Modules, Features.
- `lightweight`: overview + Business Rules/open questions.
- `standard`: Requirements, Screens, Flows, APIs, Tests, Decisions.
- `full`: DB/NFR/integration/mobile/operations detail and full bodies.

## Audiences

- `general`: all types allowed by the selected detail profile.
- `business`: intent, requirements, rules, flows, decisions.
- `developer`: implementation-facing details such as API/DB/integration/mobile technical assets.
- `qa`: requirements, rules, screens/flows, APIs and Test Cases.

## Drift and conflicts

```bash
npm run blueprint:diff
npm run blueprint:check
```

A linked document changed after the last compile → `stale`.

The linked document and its old inline seed row both changed → `conflict`.

After review, prefer canonical documents automatically with:

```bash
npm run blueprint:reconcile -- --prefer linked
```

The tool intentionally does not auto-prefer inline Blueprint content over a linked canonical document.
