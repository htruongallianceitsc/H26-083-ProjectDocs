# Document Freshness Standard — v5.3

## Purpose

A document can be recently reviewed and still be stale when one of its documented dependencies changes. V5.1 therefore tracks dependency fingerprints separately from `last_reviewed_at`.

## Source of truth

- Policy: `kit/registry/freshness-rules.json`
- Review snapshots: `.project-docs/freshness/*.json`
- Canonical content: project Markdown under `docs/`
- Generated summary: `docs/_generated/freshness.json`

## Lifecycle

```text
UNTRACKED
   ↓ reconcile
FRESH
   ↓ dependency changes
STALE
   ↓ review/update/reconcile
FRESH
```

`SELF_CHANGED` means the tracked document itself changed after reconciliation while its dependencies did not. It is visible for review but does not block the default gate.

## Rules

1. A reconciliation snapshot records the current document hash and the hashes of configured dependencies.
2. Dependency addition/removal counts as drift, not only content modification.
3. Feature freshness includes direct related entities and Requests promoted into that Feature.
4. Task/Bug operational edges are excluded from Feature freshness by default to avoid circular implementation noise.
5. `STALE` blocks Ready/Done when `implementationGate.blockOnStaleDocumentation=true`.
6. `UNTRACKED` is non-blocking by default so existing projects can adopt v5.3 progressively.
7. Reconcile only after a human/AI review has actually checked whether the document remains correct.

## Commands

```bash
npm run doc:check -- --entity FEAT-AUTH-LOGIN
npm run doc:check
npm run doc:reconcile -- --entity FEAT-AUTH-LOGIN --reviewer "Reviewer" --note "Reviewed after API change"
```
