# Workflow 25 — Project Documentation Bundle Transfer

## Goal

Transfer project knowledge from an older starter version to the current starter through one portable ZIP, without requiring the user to understand historical folder-layout changes.

## Source project

1. Ensure the source project contains the canonical typed documentation that should move.
2. For a v5.15+ source, run `npm run docs:export` from that project's `tools/`.
3. For a v5.14-or-earlier source, run the v5.15 toolchain against the old path instead of modifying the old starter:

   ```bash
   cd <new-v5.15-project>/tools
   npm run docs:export -- --source ../../OldProject
   ```

4. Keep the generated `<source>/.project-docs/exports/ProjectDocsExport.zip` unchanged during transfer.

Optional integrity inspection:

```bash
npm run docs:bundle:inspect -- --file .project-docs/exports/ProjectDocsExport.zip
```

## Target project

1. Start from the desired newer starter version.
2. Preview when the target already contains project entities:

   ```bash
   cd tools
   npm run docs:import -- --file ../ProjectDocsExport.zip --dry-run
   ```

3. Import:

   ```bash
   npm run docs:import -- --file ../ProjectDocsExport.zip
   ```

4. Review `.project-docs/imports/IMP-.../import-report.json` if conflicts, unmapped entities or post-import validation failures are reported.
5. Resolve project-specific semantic gaps in canonical docs; never edit generated site/catalog files as truth.

## Safety rules

- Never overwrite a different target entity silently.
- Preserve existing UID/code whenever present.
- Assign deterministic portable UID only when the source lacks one.
- Treat folder paths as placement, not identity.
- Use the target starter's `documentation-bundle.json` mapping as the authority for current paths.
- Keep source profile/Blueprint as import evidence unless a human deliberately reconciles them into the target.

## Exit criteria

- Bundle integrity passed.
- All required entities are imported or explicitly reported as conflicts/unmapped.
- Post-import validation/reindex/sync/build/link-check passed, or failures are documented for remediation.
- Canonical target docs remain the only project truth.
