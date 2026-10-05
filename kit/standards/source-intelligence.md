# Source Intelligence Standard

## Purpose

Source code is implementation evidence, not the canonical project knowledge model. The durable project model remains documentation entities and their relations. Source indexes are disposable and rebuildable.

## Configuration

Use `kit/registry/source-intelligence.json` to configure scan roots, extensions, ignored directories, mapping behavior, explicit path mappings, and Git defaults.

## Source index

Run:

```bash
npm run source:scan
```

The generated `.project-docs/indexes/source-index.json` records:

- file path/hash/size/line count/language
- lightweight symbols
- imports and resolved relative dependencies
- reverse dependents
- evidence mapping source files to project entities

Mapping evidence can come from:

1. application source-root ownership
2. explicit path mappings
3. entity code mentions
4. technical identifiers such as API paths or screen routes

Heuristic source evidence must not silently become a durable project relation.

## Mapping inspection

```bash
npm run source:map -- --path apps/web/src/features/auth/Login.tsx
npm run source:map -- --entity FEAT-AUTH-LOGIN
```

Always inspect evidence before relying on medium-confidence mappings.

## Git impact

```bash
npm run git:status
npm run git:impact
npm run git:impact -- --commit HEAD
npm run git:impact -- --from v1.0.0 --to HEAD
```

Git impact means graph-based potential impact, not proof of runtime behavior. The algorithm maps changed source files to direct entities, then expands through configured project impact rules.
