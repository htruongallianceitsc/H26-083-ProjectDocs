# Reuse Strategy

## Purpose
Use the lightest reuse mechanism that preserves consistency. Feature Standards and Capability Packs are complementary, not competing mechanisms: Standards define what good looks like; Packs provide a reusable baseline when repeated evidence justifies the maintenance cost.

## Reuse levels & order
`Template -> Standard -> Pattern Pack -> Capability Pack -> Project-local customization`

1. **Template** - document shape only.
2. **Standard** - mandatory rules and review checklist.
3. **Pattern Pack** - reusable skeleton, relations and placeholders.
4. **Capability Pack** - versioned, substantially complete reusable capability with variants, provenance and upgrade support.

## Decision rule
Use a Capability Pack when a capability has appeared in at least three projects, is at least 70% structurally/behaviorally similar, and is stable enough that upstream maintenance has positive ROI. Use a Pattern Pack when structure repeats but project-specific behavior is still material. Otherwise use Standards.

## Key governance
- Reuse detection happens before detailed feature decomposition.
- Existing compatible packs should be considered before AI generates a parallel capability.
- Packs are preview-first and review-gated.
- Project-local docs are source of truth after import.
- Upgrade uses three-way comparison.
- Capability Packs are portfolio assets with owners, semantic versions and changelogs.
- Packs can be demoted if local overrides/conflicts become excessive.
