# Workflow 17 — Source Workspace Bootstrap / Adoption

```text
Project Profile
   ↓
Application Boundary
   ↓
Source Profile
   ↓
New? ── yes ──> Source Base + source:init
   │
   no
   ↓
source:adopt existing root
   ↓
Application entity + source.lock provenance
   ↓
source:check
   ↓
Feature → Application mapping
   ↓
Ready Gate → WorkPlan(applicationScope) → Tasks
```

A Source Base is bootstrap input only. Upgrades are separate reviewed migrations.

## v5.7 existing-project continuation

For `source:adopt`, continue with Workflow 18 (`18-brownfield-adoption.md`) before treating reverse-engineered documentation as an accepted baseline. Adoption establishes the source boundary only; it does not by itself reconstruct Feature/API/Screen/Test semantics.
