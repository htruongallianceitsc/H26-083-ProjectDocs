# v5.8 Upgrade Notes — Acceptance & Verification Traceability

## Goal

Make Business Rule and Acceptance Criteria usage traceable from BA specification through QA verification without introducing one standalone entity/file per Acceptance Criterion.

## Canonical model

```text
Feature
  ├─ Requirement
  │    └─ AC stable sub-ID (REQ-CODE#AC-ID)
  │           └─ Test Case
  └─ Business Rule
       ├─ positive Test Case
       └─ negative Test Case (required for critical rules)
```

Acceptance Criteria stay inside Requirement Markdown as stable table rows. Test Cases hold exact verification references in addition to normal entity relations.

## New metadata

Requirement body:

```markdown
| ID | Type | Scenario | Criterion |
|---|---|---|---|
| AC-01 | happy-path | ... | Given ... When ... Then ... |
```

Test Case frontmatter:

```yaml
acceptance_criteria: [REQ-AUTH-001#AC-01]
business_rule_cases: [BR-AUTH-001#positive]
```

Business Rule frontmatter:

```yaml
criticality: critical
verification_profile: positive-negative
```

## New tooling

- `verification:status`
- `verification:check`
- `tools/lib/verification.mjs`
- `tools/scripts/verification-tool.mjs`

`npm run qa` now includes `verification:check`.

## New quality rules

- `requirement-acceptance-coverage`
  - approved/in-progress/implemented Requirements need stable AC IDs;
  - at least one Test Case must link to the Requirement;
  - every AC must be covered by an exact Test Case reference.
- `critical-business-rule-verification`
  - approved critical Business Rules require positive and negative Test Case coverage.

The engine also detects unknown AC refs, malformed Business Rule case refs, duplicate AC IDs, and relation/reference alignment gaps.

## Relation model improvements

v5.8 adds explicit mappings for:

- Requirement → Business Rule;
- Test Case → Business Rule;
- Business Rule → Test Case.

These common verification relationships no longer rely on wildcard fallback mappings.

## Ready / Done integration

Ready and Done gates now consume verification findings scoped to the Feature context. Lightweight Features without Requirement/Test entities remain supported; Standard/Full features benefit from exact verification coverage.

## Generated views

- `docs/_generated/verification.json`
- `.project-docs/reports/verification-report.json`
- `.project-docs/site/verification.html`
- Acceptance coverage column in generated Traceability Matrix.

All generated verification files are derived. Canonical truth remains in Requirement, Business Rule, and Test Case documents.
