# v5.11 QA Report

**Version:** 5.11.0  
**Focus:** Optional Screen-First Wireframe Analysis  
**Result:** PASS

## Scope

QA verifies that v5.11 preserves previous Documentation-First behavior while adding a review loop from canonical Screen docs to text/ASCII/HTML wireframes and back to canonical documentation via governed gap proposals.

## Full QA suite

Executed:

```bash
cd tools
npm run qa
```

Results:

- Workspace layout: **0 errors, 0 warnings**.
- Registry: **0 errors**; 32 entity types, 55 relation rules, 11 quality rules.
- Project profile: **28 applicable core standards**, including `screen-first-wireframe-analysis.md`.
- Reusable packs: **2 validated, 0 errors**.
- Source Bases: **6 bases / 12 variants, 0 errors**.
- Verification: **0 errors, 0 warnings**.
- Mockup check: **PASS**.
- Wireframe check while optional mode inactive: **PASS / skipped by policy**.
- Documentation validation: **0 errors, 0 warnings**.
- Doctor: **0 errors, 0 warnings**.
- Static documentation site: **330 document pages**.
- Site link check: **0 broken links**.

## Dedicated Wireframe E2E

The v5.11 Wireframe E2E passed the full governed path:

1. start a Screen-scoped review session;
2. parse a canonical Screen document;
3. generate semantic JSON projection;
4. generate text-based wireframe;
5. generate ASCII preview;
6. generate combined HTML wireframe;
7. record a review gap;
8. accept the gap and verify it blocks completion;
9. resolve the gap and verify the check passes;
10. change the canonical Screen after generation and verify stale projection detection;
11. rebuild projection;
12. close the review session successfully.

Result:

```text
Wireframe E2E: PASS
(Screen docs -> semantic spec -> text/ASCII/combined HTML
 -> gap governance -> stale detection -> close)
```

## Regression E2E

All retained workflows passed:

- Main regression suite: **PASS**.
- Blueprint E2E (v5.9): **PASS**.
- Mockup E2E (v5.10): **PASS**.
- Wireframe E2E (v5.11): **PASS**.

## Safety/governance assertions verified

- Screen-first mode is inactive by default.
- Normal QA does not require a project to use wireframes.
- Generated HTML/ASCII/text artifacts are derived projections.
- HTML review does not auto-patch canonical docs.
- Accepted unresolved gaps are blocking during an active review session.
- Canonical Screen changes invalidate previous projection hashes.
- Rebuild clears stale projection findings.
- Existing v5.10 mockup ingestion and drift detection remain functional.

## Conclusion

v5.11 is compatible with the existing starter-kit lifecycle and adds a controlled optional Screen-first review loop. The recommended representation model is **semantic text contract first, HTML for primary human review, ASCII for quick inspection**. The combined HTML wireframe can safely be regenerated from canonical Screen documentation without becoming a competing source of truth.
