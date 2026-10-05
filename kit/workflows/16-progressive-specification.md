# Workflow 16 — Progressive Specification / Lightweight Mode

## Goal

Choose documentation depth intentionally, avoid over-documenting mock/POC work, and preserve a deterministic promotion path to Standard or Full.

## Steps

1. Resolve project default from `project.profile.json.documentation.defaultSpecLevel`.
2. For each Feature, decide whether an override is needed.
3. Run recommendation when risk/maturity is unclear:
   ```bash
   cd tools
   npm run spec:recommend -- --feature FEAT-...
   ```
4. Author the Feature using the selected depth. Use `kit/templates/lightweight-feature-template.md` for Lightweight.
5. Check the selected profile:
   ```bash
   npm run spec:check -- --feature FEAT-...
   npm run gate:ready -- --feature FEAT-...
   ```
6. Before moving to a higher delivery maturity, generate a promotion gap report:
   ```bash
   npm run spec:promote -- --feature FEAT-... --to standard
   ```
7. Create only the missing canonical entities/contracts supported by confirmed knowledge.
8. Re-run the promotion report; apply only when no target-level gaps remain.
9. Update `PROJECT_BLUEPRINT.md` with current spec level and maturity.

## Exit criteria

- Effective spec level is explicit and appropriate for current maturity.
- Risk recommendation is reviewed.
- Current Ready gate passes for the chosen level.
- Promotion gaps are visible before UAT/production hardening.
