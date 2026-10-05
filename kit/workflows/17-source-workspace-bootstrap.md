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
