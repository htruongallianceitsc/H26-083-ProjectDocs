# Workflow 15 — Freshness, Impact, ChangeSet and Baseline

## Use when

A reviewed feature/requirement/API/business rule changes, or before UAT/release snapshots.

## Flow

```text
Change request / edit intent
        ↓
Impact analysis
        ↓
Update canonical docs
        ↓
Freshness check
        ↓
Review affected docs
        ↓
Reconcile stale documents
        ↓
Ready / Done gate
        ↓
ChangeSet scan
        ↓
Optional Baseline at milestone
```

## Steps

1. Run `npm run impact -- --entity <CODE>` before a material change.
2. Update canonical project documentation.
3. Run `npm run doc:check` or target the affected Feature.
4. Review every `STALE` dependency result; update documentation when needed.
5. Run `doc:reconcile` only after that review.
6. Rerun Ready/Done and `npm run qa`.
7. Record the batch with `changeset:scan`.
8. Create a named baseline for UAT/release/migration boundaries.
