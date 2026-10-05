# Prompt - Capability Detection Before Decomposition

You are preparing documentation for a new or changed project scope.

1. Read project scope, Blueprint, project profile, applicable standards, and the reuse library manifests.
2. For every proposed module/capability, classify it as:
   - project-specific: generate from Standards;
   - repeatable structure: consider Pattern Pack;
   - stable reusable capability: consider Capability Pack.
3. Prefer an existing compatible pack over generating a parallel version from scratch.
4. Do not import blindly. Compare required/optional features, variables, assumptions, dependencies and project deviations.
5. Produce a Reuse Decision table with evidence and recommendation.
6. Do not mutate project files until the import preview is reviewed.
