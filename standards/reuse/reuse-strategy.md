# Reuse Strategy

## Purpose
Use the lightest reuse mechanism that preserves consistency. Reuse is a governance decision, not a copy/paste shortcut.

## Reuse levels
1. **Template** - document shape only.
2. **Standard** - mandatory rules and review checklist.
3. **Pattern Pack** - reusable skeleton, relations and placeholders.
4. **Capability Pack** - versioned, substantially complete reusable capability with variants, provenance and upgrade support.

## Decision rule
Use a Capability Pack when a capability has appeared in at least three projects, is at least 70% structurally/behaviorally similar, and is stable enough that upstream maintenance has positive ROI. Use a Pattern Pack when structure repeats but project-specific behavior is still material. Otherwise use Standards.

## Source of truth
After import, project-local documents are canonical. Pack metadata belongs under `.project-docs/`; do not put upstream version facts into business frontmatter.
