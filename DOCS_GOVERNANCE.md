# Documentation Governance v4

## Source of truth
Project-local canonical docs are authoritative. Generated indexes/site are disposable. Capability/Pattern Pack sources are reusable upstream inputs, not runtime project truth.

## Required gates
1. Profile and standards resolved.
2. Reuse decision completed for repeated capabilities.
3. No silent pack import/upgrade.
4. Typed relations valid and no blocking Open Questions.
5. Requirements and critical features have test coverage.
6. Imported/upgraded packs are reviewed before implementation when `blockOnPackReviewPending` is enabled.
7. `npm run docs:all` passes before release/readiness handoff.

## Reuse governance
- Prefer Standard-only for project-specific/unstable behavior.
- Pattern Pack for repeated structure.
- Capability Pack for repeated stable semantics with positive maintenance ROI.
- Demote/retire packs that produce excessive local overrides or upgrade conflicts.
