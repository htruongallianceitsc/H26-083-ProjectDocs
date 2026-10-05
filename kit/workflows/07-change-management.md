# Workflow 07 — Change Management

## When a change request arrives

1. Capture a durable Request when provenance/change history matters.
2. Analyze affected canonical entities and incoming/outgoing relations.
3. Perform potential impact analysis.
4. Create/update canonical Feature/Requirement/Rule/Screen/Flow/API/DB/Test docs.
5. Record a Decision when the change requires a meaningful product/architecture choice.
6. Update Blueprint/Traceability/Changelog as needed.
7. Promote the Request to the durable target entities.
8. Run validation and the Ready gate.
9. Create/review/approve a WorkPlan.
10. Materialize implementation Tasks only from the approved non-stale plan.
11. After implementation, reconcile docs/tests and run the Done gate.

## Do not

- Jump from request text directly to code.
- Treat the Request note as the final requirement.
- Create implementation Tasks before documentation is Ready.
- Approve a WorkPlan after documentation changed.
- Fix a gate failure by weakening policy without review.
- Put new business rules only inside Task notes.
