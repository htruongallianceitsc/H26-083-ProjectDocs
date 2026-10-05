# Workflow 03A - Reuse and Capability Detection

Run this after Scope/Blueprint and before detailed Module/Feature decomposition.

1. Inventory proposed capabilities/modules.
2. Run `npm run pack:list` from `tools/`.
3. Compare each capability to available Capability/Pattern Packs.
4. For a new repeated candidate, run `npm run reuse:assess -- ...` with observed evidence.
5. Choose:
   - existing Capability Pack -> preview import;
   - existing Pattern Pack -> preview import then complete project-specific TODOs;
   - no suitable pack -> generate from applicable Standards.
6. Record the decision using `templates/reuse/reuse-assessment-template.md` when material.
7. Continue to Module/Feature decomposition only after reuse choices are understood.

Never create a new pack merely to avoid writing one project-specific feature.
