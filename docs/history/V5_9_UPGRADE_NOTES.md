# v5.9 Upgrade Notes — Blueprint Projection & Progressive Documentation

## Goal

Allow projects to start from one `PROJECT_BLUEPRINT.md`, progressively promote detail into canonical docs only when needed, and compile existing docs back into one project-level view at different detail/audience levels.

## New model

```text
Blueprint inline seed
   ↓ expand
reviewable candidates
   ↓ explicit review / promote
canonical typed docs
   ↓ compile / render
Blueprint projections
```

Ownership is explicit:

- `inline` — Blueprint seed is canonical;
- `linked` — canonical Markdown under `docs/` owns detail;
- `generated` — derived projection only.

## New registry

`kit/registry/blueprint-profiles.json` defines:

- detail profiles: `overview`, `lightweight`, `standard`, `full`;
- audience profiles: `general`, `business`, `developer`, `qa`;
- managed block markers;
- ownership policy;
- seed sections and review-before-promotion policy.

## New commands

- `blueprint:init`
- `blueprint:expand`
- `blueprint:review`
- `blueprint:promote`
- `blueprint:compile`
- `blueprint:render`
- `blueprint:status`
- `blueprint:diff`
- `blueprint:reconcile`
- `blueprint:check`

`blueprint:check` is part of `npm run qa`.

## Blueprint → docs

Seed tables can describe Modules, Features, Requirements, Business Rules, Screens, APIs, Database Objects and Test Cases. `expand` creates candidates only. Accepted candidates are promoted in dependency order and the promotion pass rebuilds useful relations such as Module→Feature, Feature→Requirement/Rule/Screen/API/DB/Test and Requirement→Test.

## Docs → Blueprint

`blueprint:compile` refreshes a managed block inside `PROJECT_BLUEPRINT.md` while preserving human-authored seed sections. Existing canonical docs that were not originally created from Blueprint are registered as linked knowledge when compiled.

`blueprint:render` creates standalone derived files under `.project-docs/blueprint/rendered/` without changing canonical docs.

## Round-trip safety

State under `.project-docs/blueprint/` stores source hashes, seed hashes and ownership. `blueprint:diff` detects:

- stale linked summaries;
- missing linked documents;
- conflicts when both a linked document and its old Blueprint seed changed.

Automatic reconciliation only supports `--prefer linked`; preferring inline content requires manual review/promotion.

## Relation model improvements

v5.9 adds explicit mappings for common Blueprint promotion links:

- Module → Feature;
- Requirement → Feature;
- Business Rule → Feature;
- Database Object → Feature;
- Test Case → Feature.

These no longer rely on wildcard fallback mappings.

## Static site

The generated site adds a **Blueprint** page showing inline/linked/generated counts, pending candidates, stale projections and ownership conflicts.

## Compatibility

Blueprint status is tolerant of older workspaces that do not yet contain `PROJECT_BLUEPRINT.md`. `blueprint:compile` can create a minimal Blueprint entry point when one is missing.
