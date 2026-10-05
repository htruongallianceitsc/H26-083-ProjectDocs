# V4 Reuse Strategy

## Why v4 changes the model
Feature Standards and Capability Packs are complementary, not competing mechanisms. Standards define what good looks like. Packs provide a reusable baseline when repeated evidence justifies the maintenance cost.

## Required order
`Template -> Standard -> Pattern Pack -> Capability Pack -> Project-local customization`

## Key governance
- Reuse detection happens before detailed feature decomposition.
- Existing compatible packs should be considered before AI generates a parallel capability.
- Packs are preview-first and review-gated.
- Project-local docs are source of truth after import.
- Upgrade uses three-way comparison.
- Capability Packs are portfolio assets with owners, semantic versions and changelogs.
- Packs can be demoted if local overrides/conflicts become excessive.
