# Local Knowledge Engine Standard

## Purpose

The project folder remains the source of truth while derived indexes make discovery fast for humans, CI, and AI agents. No database is required for local search or context assembly.

## Derived indexes

Run:

```bash
npm run knowledge:reindex
```

The engine creates rebuildable indexes under `.project-docs/indexes/`:

- `entity-index.json`
- `relation-index.json`
- `search-index.json`
- `source-index.json`

Never edit these indexes as business data.

## Search

```bash
npm run search -- --text "reset password"
npm run search -- --text withdrawal --type api
```

Search spans entity metadata and Markdown body text.

## Query

```bash
npm run query -- --expr "type=bug AND status!=closed"
npm run query -- --expr "type=feature AND (status=planned OR status=in_progress)"
npm run query -- --expr "type=test-case" --related-to FEAT-AUTH-LOGIN --max-depth 2
```

Supported operators are `=`, `!=`, `~=`, `^=`, `$=`, `>`, `>=`, `<`, `<=` plus `AND`, `OR`, `NOT`, and parentheses.

## Context packs

```bash
npm run context -- --entity FEAT-AUTH-LOGIN
```

A context pack combines the root entity, bounded graph neighbors, and available source evidence. It is intended to reduce broad repository scanning by AI agents.

## Doctor

```bash
npm run doctor
npm run doctor -- --fix
```

Doctor checks identity, relations, index freshness, source-index freshness, saved-view expressions, and required local runtime folders. `--fix` only performs safe repairs such as rebuilding derived indexes and creating expected folders.
