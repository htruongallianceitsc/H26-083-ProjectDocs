# Reuse Model in v4

V4 uses four reuse levels:

1. **Template** - structure only.
2. **Standard** - reusable rules/checklists.
3. **Pattern Pack** - reusable skeleton and relationship pattern.
4. **Capability Pack** - versioned, substantially complete reusable capability.

## Decision flow

```mermaid
flowchart TD
  A[New capability/module] --> B{Suitable existing Capability Pack?}
  B -- Yes --> C[Preview import]
  C --> D[Configure optional features and variables]
  D --> E[Review/approve]
  E --> F[Project-local canonical docs]
  B -- No --> G{Suitable Pattern Pack?}
  G -- Yes --> H[Import skeleton and complete TODOs]
  G -- No --> I[Generate from Standards]
  I --> J{Repeated across projects?}
  J -- No --> F
  J -- Yes --> K[Reuse assessment]
  K --> L[Promote to Pattern/Capability Pack only with evidence]
```

## Rule of thumb
A capability normally needs at least three occurrences, 70%+ similarity and stable semantics before becoming a Capability Pack. Security/cross-cutting baselines may justify earlier promotion.

AUTH is the reference Capability Pack. COMMON CRUD is the reference Pattern Pack.
