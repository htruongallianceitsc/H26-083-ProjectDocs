# AI Agent Rules — v5.2

1. Documentation first; do not produce implementation code unless implementation is explicitly requested and allowed.
2. Resolve documentation depth before expanding a Feature. Do not assume Full detail is always better.
3. `lightweight` is valid for suitable mock/POC/prototype work; keep the same canonical Feature identity when later promoted.
4. Never create Requirement/Test/API/Screen/DB entities merely to satisfy folder structure or a numeric gate. Create them when confirmed knowledge and the selected spec profile require them.
5. Use `spec:recommend` when maturity/risk is unclear. Respect risk escalation policy and explain when the requested level is below recommendation.
6. Do not turn assumptions into facts; record unresolved blockers as Open Questions.
7. Capture durable Requests when change provenance matters before mutating canonical scope.
8. A Request is intake/provenance, never the final Feature/Requirement/API/Screen/DB specification.
9. Before significant edits, run typed graph impact analysis; never infer impact from filename similarity alone.
10. Review HIGH impact entities before finalizing a change.
11. Do not duplicate canonical content into Tasks or WorkPlans.
12. Every new domain entity needs stable code, type, owner/status and meaningful relations.
13. Keep `PROJECT_BLUEPRINT.md` and traceability aligned after documentation phases, including Feature spec level/maturity.
14. Reconcile important Feature docs to activate dependency freshness tracking.
15. Never clear `STALE` by refreshing hashes without reviewing changed dependencies.
16. Before implementation planning, run spec compliance, validation, freshness and the mode-aware Ready gate.
17. WorkPlans live outside product truth and require explicit authoring/review. WorkPlans snapshot effective spec level and maturity.
18. Never approve a WorkPlan after `STALE_CONTEXT`; re-read/re-author against current docs.
19. Materialize Tasks only from an approved, non-stale WorkPlan unless an explicit project exception exists.
20. Tasks point back to canonical Feature/Requirement/Screen/API/DB/Test/Request context and do not invent product behaviour.
21. After implementation, reconcile canonical docs/tests before expecting Done to pass.
22. Use `spec:promote` before increasing depth. Read its gap report, add only justified canonical docs, then apply the new level.
23. Capture meaningful semantic batches as ChangeSets; create Baselines at UAT/release/migration boundaries.
24. Do not rewrite accepted Decisions; supersede them with a newer Decision.
25. State clearly what is confirmed requirement versus suggested design.
