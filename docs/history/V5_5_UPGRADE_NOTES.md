# v5.5 Upgrade Notes - Knowledge Runtime Foundations

## Goal

v5.5 implements the three highest-priority improvements identified after v5.4:

1. harden entity identity, lifecycle and relation semantics;
2. connect documentation to source/Git evidence;
3. add fast local search, query, context and workspace diagnostics.

The release is intentionally local-first and backward-compatible with the existing Markdown/frontmatter model.

## 1. Entity model hardening

### Permanent UID and revision

New typed entities automatically receive:

```yaml
uid: <uuid>
revision: 1
```

Existing `code` values remain the normal human-facing project reference. Legacy entities without UID are still readable and can be migrated with:

```bash
cd tools
npm run entity:identity-backfill
npm run entity:identity-backfill -- --apply
```

### Lifecycle transitions

All entity types now define:

- `initialStatus`
- `transitions`
- `terminalStatuses`

Use `entity:transition` for governed status changes. The command rejects invalid jumps.

### Relation semantics

`registry/relation-map.json` is upgraded to schema 1.1. Relation rules now include:

- stable rule key
- semantic relation and reverse names
- min/max cardinality
- required flag
- unresolved-target policy
- fallback marker

Exact type mappings take precedence over wildcard compatibility mappings. Fallback mappings remain supported for legacy flexibility but are reported as review warnings when used.

## 2. Source intelligence and Git impact

New configuration:

```text
registry/source-intelligence.json
```

New derived index:

```text
.project-docs/indexes/source-index.json
```

The source scanner records file hashes, language, lightweight symbols, imports, relative dependencies/dependents, and mapping evidence back to project entities.

Commands:

```bash
npm run source:scan
npm run source:map -- --path <file>
npm run source:map -- --entity <code-or-uid>
npm run git:status
npm run git:impact
npm run git:impact -- --commit HEAD
npm run git:impact -- --from <ref> --to <ref>
```

Source mappings are evidence only. Heuristic matches do not silently create canonical documentation relations.

## 3. Search, query, context and Doctor

New configuration:

```text
registry/local-engine.json
registry/views.json
```

New derived indexes:

```text
.project-docs/indexes/entity-index.json
.project-docs/indexes/relation-index.json
.project-docs/indexes/search-index.json
```

Commands:

```bash
npm run knowledge:reindex
npm run search -- --text "..."
npm run query -- --expr "..."
npm run context -- --entity <code-or-uid>
npm run view:list
npm run view:run -- --view <id>
npm run doctor
npm run doctor -- --fix
```

Context packs combine bounded graph neighbors and available source evidence so AI agents can work from focused project context instead of repeatedly scanning the full repository.

Doctor reports broken/ambiguous model state and stale derived indexes. `--fix` only repairs safe derived runtime state.

## Compatibility

- Existing Markdown/frontmatter entities continue to work.
- Missing legacy UIDs are warnings until backfilled.
- Existing relation fields remain valid; relation semantics are enriched rather than replacing frontmatter syntax.
- Existing v5.4 Source Base behavior is preserved.
- Derived indexes can be deleted and rebuilt without losing business/project truth.

## Recommended upgrade sequence

```bash
cd tools
npm ci
npm run registry:sync
npm run entity:identity-status
npm run entity:identity-backfill
npm run entity:identity-backfill -- --apply
npm run source:scan
npm run knowledge:reindex
npm run doctor
npm run qa
```
