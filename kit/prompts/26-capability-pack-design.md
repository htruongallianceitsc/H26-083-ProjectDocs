# Prompt 26 — Design a Reusable Capability Pack

You are designing a versioned reusable capability pack for this documentation-first starter kit.

## Input

- Capability: `<AUTH | USER PROFILE | FILE UPLOAD | NOTIFICATION | ...>`
- Existing project examples/reference docs: `<paths or summary>`
- Target starter schema: `3.x`

## Task

1. Identify capability invariants shared across projects.
2. Identify project-specific values/rules that must NOT be hard-coded.
3. Propose required and optional features.
4. Define variables with types/defaults/allowed values and mark security/product-sensitive defaults as `reviewRequired`.
5. Identify dependencies on integrations or other packs.
6. Define stable entity codes and file inventory.
7. Create a `manifest.json` compatible with `kit/registry/capability-pack.schema.json`.
8. Create reusable entity documents with only safe defaults.
9. Ensure optional features can be excluded without dangling relations.
10. Define semantic version and upgrade policy.
11. Run/mentally verify pack validation criteria.

## Constraints

- Project-local docs become canonical after import.
- Do not store secrets.
- Do not embed environment-specific URLs.
- Do not hard-code product/security policy that should be an ADR/Open Question/Requirement.
- Prefer fewer high-quality reusable entities over a very large generic pack.
