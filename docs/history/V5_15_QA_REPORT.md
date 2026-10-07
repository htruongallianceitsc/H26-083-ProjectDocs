# v5.15 QA Report

## Scope

Project Documentation Bundle export/import, stable transport schema, current-layout mapping, legacy identity normalization, idempotence, conflict protection and full starter QA regression.

## Automated bundle coverage

`tools/scripts/bundle-e2e.mjs` verifies:

- export from a simulated v5.10 starter;
- ZIP integrity inspection;
- import into a simulated v5.15 target;
- Module and Feature placement into the current layout;
- deterministic UID backfill for legacy entities without UID;
- repeated-import idempotence;
- changed-target conflict detection without silent overwrite.

## Post-import rebuild smoke test

A separate smoke test exported two typed entities from a simulated v5.10 workspace and imported them into a complete v5.15 workspace with the default post-import reconciliation enabled.

Result:

- 2 entities imported;
- 1 relation transferred;
- 0 conflicts;
- 0 unmapped entities;
- validation PASS;
- knowledge reindex PASS;
- generated docs sync PASS;
- static site build PASS;
- static site link check PASS.

## Full regression

`cd tools && npm run qa`:

- workspace layout PASS;
- documentation bundle registry PASS (34 entity type mappings);
- registry PASS (34 entity types / 58 relation rules / 13 quality rules);
- profile/standards PASS;
- reusable packs PASS;
- source-base/source workspace/source intelligence PASS;
- progressive specification PASS;
- acceptance/verification PASS;
- Blueprint PASS;
- Mockup workflow PASS;
- Wireframe workflow PASS;
- documentation validation PASS;
- knowledge index/Doctor/freshness PASS;
- docs sync/static site/link check PASS;
- legacy E2E regression PASS;
- Blueprint E2E PASS;
- Mockup E2E PASS;
- Wireframe E2E PASS;
- Documentation Bundle E2E PASS.

## Result

**PASS — v5.15 is ready for packaging.**
