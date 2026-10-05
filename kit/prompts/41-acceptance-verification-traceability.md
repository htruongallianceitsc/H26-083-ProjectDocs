# Prompt 41 — Acceptance & Verification Traceability

Use this prompt when refining Requirements, Business Rules, and Test Cases.

## Instructions

1. Preserve existing Requirement and AC identifiers unless semantics changed materially.
2. Express each observable acceptance outcome as a stable `AC-*` row under `## Acceptance Criteria`.
3. Keep ACs specific enough for verification but do not repeat implementation steps.
4. Reuse Business Rule entities for reusable policy/constraint logic rather than duplicating the same rule into many ACs.
5. Mark only genuinely important rules as `criticality: critical`.
6. For every Test Case, populate both entity relations and exact verification refs:
   - `acceptance_criteria: [REQ-...#AC-..]`
   - `business_rule_cases: [BR-...#positive|negative]`
7. Identify uncovered ACs, invalid refs, Requirements with no tests, and critical rules lacking positive/negative tests.
8. Never create standalone Acceptance Criterion entities unless the project explicitly overrides the v5.8 standard.

## Expected output

Return changes grouped as:

- Requirement AC additions/changes;
- Business Rule criticality/verification changes;
- Test Case mappings;
- coverage gaps;
- IDs that must remain stable;
- follow-up verification commands.
