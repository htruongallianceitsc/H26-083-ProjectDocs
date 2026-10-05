# v5.0 QA Report

## Scope

Validation of the v5.0 documentation-first governance milestone.

## Full QA result

Executed from `tools/`:

```bash
npm ci
npm run registry:sync
npm run qa
```

Result: **PASS**.

## Registry

- 31 entity types
- 36 relation rules
- 8 quality rules
- 0 registry errors

New v5 entity types are Request, Task and Bug.

## Reusable packs

- `auth-standard@1.0.0`: PASS
- `common-crud-pattern@1.0.0`: PASS
- 0 pack validation errors

Both included packs declare compatibility with starter schema 5.0.0.

## Starter workspace validation

- 251 Markdown documents scanned
- 0 project business entities, by design for the empty starter workspace
- 0 typed edges, by design for the empty starter workspace
- 0 documentation errors
- 0 documentation warnings
- 0 broken static-site links

## v5.0 E2E governance regression

Fixture starts with:

- 6 domain entities
- 6 typed edges

Regression verifies:

- Ready gate passes on approved/ready documentation.
- Request can be created and promoted to the Feature.
- WorkPlan can be scaffolded and validated.
- `requiresAuthoring` must be cleared through explicit author-complete step.
- Submit captures documentation context hash.
- Changing a linked Requirement after submit causes approval to fail with `STALE_CONTEXT`.
- Restoring reviewed context allows approval.
- Approved WorkPlan materializes 2 Task entities.
- Graph becomes 9 entities / 15 typed edges after Request + Tasks are added.
- Done gate fails while Feature/Test/Tasks remain incomplete.
- Done gate passes after Feature=`implemented`, Test=`passed`, Tasks=`done`.
- Broken relation negative test still fails validation with `BROKEN_RELATION`.

Result: **PASS**.

## Packaging acceptance

Before delivery, the final ZIP should be extracted into a clean directory and `npm ci && npm run qa` rerun to confirm the distributed artifact behaves identically.
