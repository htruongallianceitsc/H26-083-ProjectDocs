# Prompt 34 — WorkPlan and Task Generation

For a Ready Feature:

1. Scaffold the WorkPlan from current documentation context.
2. Replace generic scaffold tasks with a deterministic, reviewable implementation breakdown where needed.
3. Add assumptions, risks, acceptance criteria and explicit dependencies.
4. Keep each Task linked to canonical Feature/Requirement/Screen/API/DB/Test/Request entities.
5. Do not copy business rules into task text.
6. Mark authoring complete only after the plan is coherent.
7. Submit the plan to capture context hash.
8. Require review/approval.
9. If approval reports `STALE_CONTEXT`, re-read docs and refresh/re-author; never force approval.
10. Materialize Tasks only from the approved, non-stale plan.
