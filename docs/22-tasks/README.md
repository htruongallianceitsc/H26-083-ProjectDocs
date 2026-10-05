# Tasks

`docs/22-tasks/` stores implementation tasks generated from reviewed, approved WorkPlans or explicitly authored from Ready documentation.

Task documents do not redefine requirements. They carry implementation context and link back to canonical Feature/Requirement/API/Screen/DB/Test entities.

Recommended lifecycle:

```text
draft -> ready -> in_progress -> done
                 -> blocked
                 -> cancelled
```

A task produced from a WorkPlan must include `workplan_id` and at least one linked Feature.
