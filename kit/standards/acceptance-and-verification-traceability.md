# Acceptance & Verification Traceability Standard

## Purpose

Make acceptance evidence machine-readable without creating one document entity per Acceptance Criterion. Requirements remain canonical entities; Acceptance Criteria are stable sub-addresses inside Requirement documents; Test Cases provide executable verification evidence.

## Canonical model

```text
Feature
  ├─ Requirement
  │    └─ Acceptance Criterion (stable sub-ID)
  │           └─ verified by Test Case
  └─ Business Rule
       └─ verified by Test Case positive/negative cases
```

Acceptance Criteria are **not standalone entities**. Their permanent address is `<REQUIREMENT-CODE>#<AC-ID>`, for example `REQ-AUTH-001#AC-02`.

## Requirement Acceptance Criteria

Use a Markdown table under `## Acceptance Criteria`:

```markdown
| ID | Type | Scenario | Criterion |
|---|---|---|---|
| AC-01 | happy-path | Valid login | Given ... When ... Then ... |
| AC-02 | negative | Wrong password | Given ... When ... Then ... |
```

Rules:

1. IDs must be stable and local to the Requirement.
2. Use `AC-01`, `AC-02`, ... or another `AC-*` identifier with a clear stable suffix.
3. Never renumber accepted ACs solely for cosmetic ordering.
4. If an AC is replaced, keep history through the Requirement revision/change history; introduce a new ID when semantics materially change.
5. Approved/in-progress/implemented Requirements must expose stable AC IDs and verification coverage according to `kit/registry/quality-rules.json`.

## Test Case mapping

Test Case frontmatter may contain:

```yaml
acceptance_criteria: [REQ-AUTH-001#AC-01, REQ-AUTH-001#AC-02]
related:
  requirements: [REQ-AUTH-001]
```

`acceptance_criteria` is fine-grained verification evidence; `related.requirements` remains the entity graph relationship. Use both.

## Business Rule verification

Business Rules use:

```yaml
criticality: critical
verification_profile: positive-negative
```

Tests record polarity:

```yaml
business_rule_cases: [BR-AUTH-001#positive]
related:
  business_rules: [BR-AUTH-001]
```

and separately:

```yaml
business_rule_cases: [BR-AUTH-001#negative]
```

Critical approved Business Rules require both positive and negative coverage by default. Non-critical rules may use `verification_profile: positive` unless project policy requires stronger coverage.

## Quality gates

v5.8 adds machine-readable checks for:

- unknown `REQ#AC` references;
- approved/in-progress/implemented Requirement without stable AC IDs;
- Requirement without linked Test Cases;
- uncovered Acceptance Criteria;
- malformed Business Rule verification references;
- critical approved Business Rule without positive coverage;
- critical approved Business Rule without negative coverage.

Run:

```bash
cd tools
npm run verification:status
npm run verification:check
```

`npm run qa` includes `verification:check`.

## Source of truth

- Requirement body owns the meaning and stable ID of each AC.
- Test Case owns the execution evidence/ref mapping.
- Business Rule document owns rule criticality and intended verification profile.
- `docs/_generated/verification.json`, `.project-docs/reports/verification-report.json`, and the static Verification page are derived views and may be rebuilt.
