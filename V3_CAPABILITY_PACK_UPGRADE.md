# Starter Kit v3 — Capability Pack Upgrade

## Why v3

Repeated capabilities such as AUTH, User Profile, File Upload, Notification, Audit Log and Common CRUD should be reusable without copy/paste provenance loss or turning a shared library into an ambiguous project source of truth.

## v3 architecture

```text
Starter Core
  - registry
  - standards
  - templates
  - workflows
  - tooling
        +
Capability Pack Library
  - package manifest
  - stable codes
  - required/optional features
  - variables/constraints
  - semantic version
        ↓ preview import
Project Workspace
  - project-local canonical docs
  - normal traceability/governance
  - local customization
        +
.project-docs pack governance
  - lock
  - base snapshot
  - upgrade proposal
```

## Review proposal mapped to implementation

| Review recommendation | v3 implementation |
|---|---|
| Starter Core separate from reusable business modules | `reusable-modules/` added; starter core stays generic |
| Versioned pack manifest | `registry/capability-pack.schema.json` + `manifest.json` |
| Required/optional features | Manifest feature registry + selective import |
| Variables | Typed/default/enum/pattern variable validation |
| Avoid unsafe defaults | `reviewRequired`, pack review notes, pending review gate |
| Deterministic code remap | `--namespace` + stored `codeMap` |
| Remove disabled feature relations | Import renderer prunes pack relations |
| Provenance outside business facts | `.project-docs/packs.lock.json` |
| Preserve imported base | immutable `.project-docs/pack-snapshots/` |
| Preview before import | `pack:import` is dry-run unless `--apply` |
| Three-way upgrade | `base + local + upstream` classification |
| Do not overwrite conflicts | upgrade proposal + explicit merge acknowledgement |
| Validate pack | `pack:validate` |
| Import pack | `pack:import` |
| Diff pack | `pack:diff` |
| Upgrade pack | `pack:upgrade` |
| Owner approval after import/upgrade | `pack:review` + `blockOnPackReviewPending` |
| Visualize installed/library packs | static site `packs.html` |

## Additional v3 improvement

`registry/core-standards.json` makes Core Standards machine-readable. `profile:check` and the static Standards page now resolve standards in the actual order:

```text
Core -> Project Type -> Technology Stack -> Project ADR
```

The capability-pack standard is Core because the reuse mechanism is independent of Web/Mobile/API technology.

## Reference implementation

`reusable-modules/auth-standard@1.0.0` is executable, not placeholder-only. It demonstrates:

- required and optional features;
- project variables;
- feature/variable consistency constraints;
- Google OAuth dependency declaration;
- stable entity codes;
- selective import;
- project-local customization;
- pack review lifecycle;
- upgrade-ready provenance.
