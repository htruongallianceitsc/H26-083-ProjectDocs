# Workflow 19 — Acceptance & Verification Traceability

## Goal

Turn Requirement acceptance and Business Rule verification into reviewable, machine-checkable coverage without introducing an Acceptance Criterion entity type.

## Flow

```text
Feature / Business intent
        ↓
Requirement + Business Rule
        ↓
Assign stable AC IDs / rule criticality
        ↓
Create Test Cases
        ↓
Map Test → REQ#AC
Map Test → BR#positive / BR#negative
        ↓
verification:check
        ↓
Traceability + Verification dashboard
        ↓
Ready / WorkPlan / Done
```

## Steps

1. Write the Requirement statement and observable behaviour.
2. Add stable `AC-*` rows under `## Acceptance Criteria`.
3. Link Requirement ↔ Business Rule where a reusable policy constrains the Requirement.
4. For critical rules, set `criticality: critical` and prepare positive + negative coverage.
5. Create Test Cases and keep normal `related.requirements` / `related.business_rules` links.
6. Add exact verification refs in Test Case frontmatter.
7. Run `npm run verification:check` and resolve missing/invalid coverage.
8. Run normal `gate:ready`; after implementation, update test status/evidence and run `gate:done`.

## Do not

- create a new Markdown file for every AC;
- renumber AC IDs after review just to remove numbering gaps;
- rely on prose such as "covers login" when an exact `REQ#AC` address is available;
- use `business_rule_cases` without the normal Business Rule relation;
- treat generated verification reports as canonical project knowledge.
