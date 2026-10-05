# Entity Identity, Lifecycle and Relation Semantics

## Purpose

Project entities must remain stable even when titles, paths, or human-facing codes are refactored. v5.5 adds a permanent `uid`, local `revision`, explicit lifecycle transitions, and semantic relation metadata.

## Identity

Every newly created typed entity must contain:

```yaml
uid: 2adfca46-b57d-43d2-81f8-12b28c945532
code: FEAT-AUTH-LOGIN
revision: 1
```

Rules:

- `uid` is the permanent machine identity and must be a UUID.
- `code` remains the readable project reference and should remain stable after publication.
- `revision` increments for semantic changes made through governed mutation commands.
- Legacy entities without `uid` remain readable during migration, but validation reports `MISSING_UID`.
- Run `npm run entity:identity-backfill -- --apply` to add permanent UIDs to legacy entities.

## Lifecycle

Valid statuses and transitions are defined in `registry/entity-types.json`.

Do not infer transitions from array order. Use:

```bash
npm run entity:transition -- --entity FEAT-AUTH-LOGIN --to in_progress
```

The transition command rejects invalid jumps such as `planned -> implemented` when an intermediate state is required.

## Relation semantics

`registry/relation-map.json` is the authority for:

- source type
- relation field
- target type
- semantic relation name and reverse name
- cardinality/min/max
- requiredness
- unresolved-target policy
- whether a rule is a broad compatibility fallback

Exact typed mappings take precedence over wildcard mappings. Wildcard mappings are migration compatibility rules and should trigger review warnings when used.
