# Reuse Library

Reusable assets are grouped by reuse strength:

- `capabilities/` - versioned coherent capabilities with stable reusable semantics.
- `patterns/` - repeated technical/UI/runtime shapes whose business semantics remain project-specific.
- `templates/` - authoring/package templates.

## Selection rule
Use a Standard when the team must follow a rule, a Capability Pack when a complete stable capability repeats across projects, and a Pattern Pack when only the structure/implementation shape repeats.

Project imports remain governed by `.project-docs/packs.lock.json`, review status and `kit/registry/reuse-policy.json`. Do not import every pack by default; select only what the project needs.
