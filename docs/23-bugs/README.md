# Bugs

`docs/23-bugs/` stores durable defect records when the defect needs traceability to Feature, Requirement, Screen, API, Test, or Request entities.

Lifecycle:

```text
open -> triaged -> in_progress -> resolved -> closed
                                  -> wont_fix
```

A Bug is evidence of an observed mismatch. If fixing the bug changes intended behavior, create or link a Request/Decision and update canonical documentation first.
