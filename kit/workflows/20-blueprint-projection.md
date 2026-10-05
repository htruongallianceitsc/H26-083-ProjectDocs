# Workflow 20 — Blueprint Projection & Progressive Documentation

## Greenfield

```text
Idea
  ↓
PROJECT_BLUEPRINT.md (inline)
  ↓ blueprint:expand
Candidates
  ↓ review
blueprint:promote
  ↓
Canonical docs (linked)
  ↓
blueprint:compile / render
  ↓
Overview / Lightweight / Standard / Full projections
```

## Existing documentation

```text
Canonical docs
  ↓
blueprint:compile
  ↓
PROJECT_BLUEPRINT.md managed projection
  ↓
blueprint:render --profile ... --audience ...
```

## Conflict rule

Once an item is `linked`, edit the canonical document. If both the linked document and its old seed row change, `blueprint:diff` reports a conflict. Automatic reconciliation supports `--prefer linked`; choosing inline content requires manual review and re-promotion.
