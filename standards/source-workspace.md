# Source Workspace Standard

## Purpose

Keep documentation, governance and deployable source code in one portable project workspace.

## Canonical layout

```text
project/
├── docs/
├── .project-docs/
├── registry/
├── standards/
├── apps/
├── packages/
├── tests/
├── infra/
└── tools/
```

`apps/` contains deployable application roots. `packages/` contains reusable project-local libraries. The internal structure of an application is selected by `registry/source-profiles.json`; agents must not invent a different stack layout when a profile exists.

## Application truth

An `application` entity under `docs/24-applications/` is the canonical architecture record for an app boundary. `.project-docs/source.lock.json` records source-base provenance/materialization state only.

## Existing projects

Existing code may be adopted in place with `source:adopt`; moving it into `apps/` is recommended but not required.
