# Prompt 27 — Review Capability Pack Import

Review a capability-pack import preview before it is applied.

Check:

1. selected required/optional features match project scope;
2. variable values are appropriate for project type/technology stack;
3. code namespace and target root do not collide;
4. no project-specific business/security rule is being accepted blindly;
5. required integrations/dependencies exist or become Open Questions;
6. imported ADR/default assumptions are acceptable;
7. disabled feature relations are pruned;
8. resulting Feature -> Requirement/Screen/API/Test traceability is coherent;
9. imported files should become local canonical docs;
10. pack lock contains provenance only, not secrets/business facts.

Output:

- approve/revise import plan;
- variable changes required;
- optional features to enable/disable;
- Open Questions/ADRs to create after import;
- validation commands to run.
