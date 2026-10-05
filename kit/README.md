# Starter Kit Framework

`kit/` contains reusable framework assets used to author, validate, bootstrap, and govern projects. It is not project/domain truth and it is not generated runtime state.

## Structure

```text
kit/
├── registry/        # machine-readable model and governance configuration
├── standards/       # core, project-type, stack, reuse and engineering standards
├── prompts/         # reusable AI authoring/review prompts
├── templates/       # documentation templates
├── workflows/       # documentation-first operating workflows
├── source-bases/    # versioned greenfield source skeletons
├── reuse/
│   ├── capabilities/ # complete reusable capability packs
│   ├── patterns/     # lighter reusable pattern packs
│   └── templates/    # reusable pack/template assets
└── examples/        # starter examples that should not live at repository root
```

## Boundaries

- Put project facts and durable domain knowledge in `docs/`.
- Put real implementation in `apps/`, `packages/`, `tests/`, `infra/`, or an adopted application root.
- Put rebuildable runtime/generated state in `.project-docs/`.
- Keep executable project tooling in `tools/`.
- Add a new root under `kit/` only when the content is reusable starter-kit/framework material rather than project-specific truth.

Canonical physical paths are defined by `starter-kit.json.workspaceLayout`. Tooling should use the shared workspace resolver rather than introducing new root-path literals.
