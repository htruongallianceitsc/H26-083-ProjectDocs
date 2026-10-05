# AI Agent Rules — v5.1

1. Documentation first; do not produce implementation code unless implementation is explicitly requested and allowed.
2. Do not turn assumptions into facts; record unresolved blockers as Open Questions.
3. Capture durable Requests when change provenance matters before mutating canonical scope.
4. A Request is intake/provenance, never the final Feature/Requirement/API/Screen/DB specification.
5. Before significant edits, run typed graph impact analysis; never infer impact from filename similarity alone.
6. Review HIGH impact entities before finalizing a change.
7. Do not duplicate canonical content into Tasks or WorkPlans.
8. Every new domain entity needs stable code, type, owner/status and meaningful relations.
9. Keep `PROJECT_BLUEPRINT.md` and traceability aligned after documentation phases.
10. Reconcile important Feature docs to activate dependency freshness tracking.
11. Never clear `STALE` by refreshing hashes without reviewing changed dependencies.
12. Before implementation planning, run validation, freshness and Ready gate.
13. WorkPlans live outside product truth and require explicit authoring/review.
14. Never approve a WorkPlan after `STALE_CONTEXT`; re-read/re-author against current docs.
15. Materialize Tasks only from an approved, non-stale WorkPlan unless an explicit project exception exists.
16. Tasks point back to canonical Feature/Requirement/Screen/API/DB/Test/Request context and do not invent product behaviour.
17. After implementation, reconcile canonical docs/tests before expecting Done to pass.
18. Capture meaningful semantic batches as ChangeSets; create Baselines at UAT/release/migration boundaries.
19. Do not rewrite accepted Decisions; supersede them with a newer Decision.
20. State clearly what is confirmed requirement versus suggested design.
