# Prompt 28 — Review Capability Pack Upgrade

Review a three-way capability-pack upgrade proposal.

Inputs:

- base imported pack version;
- new upstream pack version;
- project-local customized docs;
- generated upgrade `REPORT.md` / `report.json`.

For each changed entity classify semantic impact:

- safe upstream clarification;
- safe additive change;
- project-local customization to preserve;
- business/security decision requiring project review;
- true merge conflict;
- upstream deletion that must not be automatic.

Do not overwrite local project decisions. Produce a merge recommendation per entity, affected traceability, required tests/ADRs/Open Questions and whether `--apply` or `--accept-local-merge` is appropriate.
