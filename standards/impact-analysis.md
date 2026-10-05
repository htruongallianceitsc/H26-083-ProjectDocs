# Graph Impact Analysis Standard — v5.1

## Purpose

Before changing an existing entity, inspect potential downstream/upstream impact using the typed documentation graph rather than filename similarity.

## Policy

Traversal weights and directions live in `registry/impact-rules.json`. Impact is evidence-based and means **potential impact**, not guaranteed runtime impact.

High-weight relationships include requirements, business rules, APIs, database objects, screens, permissions, tests and blocking open questions. Lower-weight relationships include grouping or implementation-management edges.

## Command

```bash
npm run impact -- --entity REQ-AUTH-001
npm run impact -- --entity API-AUTH-LOGIN -- --depth 2
```

Review high-impact entities first. If a change affects documentation that has already been reconciled, rerun freshness checks after editing.
