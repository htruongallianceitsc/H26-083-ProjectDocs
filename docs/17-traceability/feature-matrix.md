# Feature Traceability Matrix

The authoritative, always-current traceability matrix is auto-generated from entity frontmatter: run `cd tools && npm run docs:sync` (or `npm run docs:all`) and see `docs/_generated/TRACEABILITY_MATRIX.md`, or `npm run docs:build && npm run docs:serve` and open the Traceability page in the generated site.

For the authored Module/Feature/Screen/API/Database inventory (the project map), see `PROJECT_BLUEPRINT.md`.

## Gaps

Run `cd tools && npm run docs:validate` to detect:
- Features without requirements
- Requirements without tests
- Orphan screens
- Orphan APIs
- DB objects without known readers/writers
