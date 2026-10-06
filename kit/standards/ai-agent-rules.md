# AI Agent Rules — v5.12

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
26. When `mockups/` exists, inventory and analyze visual evidence before inventing Screen structure from text assumptions.
27. Never infer API/DB/hidden business rule/permission from pixels alone; emit Open Questions/TBD instead.
28. Group multiple mockups of the same logical page into Screen states/variants; do not create one Screen entity per image by default.
29. Existing approved/implemented Screen docs must not be auto-overwritten from mockup analysis; create a reviewable enrichment proposal first.
30. Treat changed mockup hashes as reconciliation triggers, not automatic truth replacement.


31. Treat Screen-first wireframes as generated projections of canonical documentation, never as a second source of truth.
32. Prefer one semantic Screen contract that can render to text/ASCII/HTML instead of independently maintaining three formats.
33. Preserve `TBD` when Screen actions, destinations, states or validation are not documented; do not invent UI behaviour to make a wireframe look complete.
34. When wireframe review reveals a gap, route the accepted change to its canonical owner (Screen, Feature, Requirement, Business Rule or Flow) before rebuilding the projection.
## v5.12 Screen lifecycle and promotion rules

- Do not model automatic Screen behaviour as fake buttons. Separate user, lifecycle, system and API actions.
- A Splash/Bootstrap Screen may legitimately have zero user actions.
- Never infer retry/cache/fallback/timeout behaviour from a loading indicator; keep it TBD/Open Question until confirmed.
- `wireframe:promote` drafts suggestions from an accepted gap; exact entity codes/relations/content require authoring before apply.
- Do not overwrite existing canonical entities during gap promotion unless replacement was explicitly reviewed.

