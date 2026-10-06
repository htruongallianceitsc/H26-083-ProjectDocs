# v5.10 QA Report

**Version:** 5.10.0  
**Capability under test:** Mockup-Driven Documentation  
**Status:** PASS

## 1. Full starter-kit QA

Command:

```bash
cd tools
npm run qa
```

Result: **PASS**.

Verified areas include:

- workspace layout validation: 0 errors, 0 warnings
- registry/schema/relation validation: 0 errors
- core standards/profile resolution
- source/spec/verification checks
- blueprint validation
- mockup workflow validation with an empty `mockups/` folder
- documentation validation and synchronization
- static documentation site generation
- site link validation: 0 broken links
- regression E2E and Blueprint E2E

## 2. Mockup workflow E2E

Command:

```bash
cd tools
npm run test:e2e
```

The v5.10 Mockup E2E verifies the full governed path:

1. inventory a synthetic mockup image;
2. provide structured vision-analysis evidence;
3. create a screen candidate;
4. accept the candidate through the review gate;
5. promote it to a draft Screen document;
6. generate mockup traceability;
7. change the source mockup;
8. detect hash drift/stale evidence.

Result: **PASS**.

## 3. Manual smoke tests

### New Screen path

Verified:

`mockup image -> inventory -> analysis -> candidate -> accepted review -> new draft Screen -> traceability/check`

Result: **PASS**.

### Existing Screen path

Verified two safety behaviors:

- default promotion produces an enrichment proposal and does **not** overwrite the existing Screen;
- explicit `--apply-existing` reconciles only managed mockup-evidence references/blocks.

Result: **PASS**.

## 4. Safety / documentation-first checks

Verified that the workflow treats mockups as **design evidence**, not complete functional truth.

The generated workflow explicitly prevents mockup-only inference of:

- API contracts;
- database schema;
- hidden business rules;
- authorization/permission models;
- server-side validation;
- non-visible edge cases.

Unknown functional behavior remains a gap/TBD/open question until supported by separate evidence or reviewed user input.

## 5. Clean starter state

After smoke testing, synthetic test assets and temporary Screen documents were removed.

The delivered starter state contains only the governed empty mockup folders plus reproducible runtime reports/indexes. `mockup:check` passes when no project mockups have been added yet.

## Conclusion

v5.10 is compatible with the existing documentation-first workflow and adds a review-gated, drift-aware path from UI mockup evidence to Screen documentation and downstream functional coverage planning.
