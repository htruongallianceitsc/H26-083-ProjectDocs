# Workflow 12 — Reusable Capability Pack Lifecycle

## Goal

Reuse repeated modules without copy/paste provenance loss or shared-document ambiguity.

## A. Create / maintain a pack

1. Identify a capability repeated across at least two projects.
2. Separate invariant behavior from project-specific decisions.
3. Define `manifest.json`, required/optional features and variables.
4. Add pack entity docs with stable codes.
5. Run `npm run pack:validate -- <pack-folder>`.
6. Version with semantic versioning.
7. Record breaking changes in pack release notes/changelog.

## B. Import into a project

```bash
cd tools
npm run pack:validate -- ../kit/reuse/capabilities/auth-standard
npm run pack:import -- ../kit/reuse/capabilities/auth-standard
```

Review preview, then:

```bash
npm run pack:import -- ../kit/reuse/capabilities/auth-standard -- \
  --apply \
  --features register,google-login \
  --set LOGIN_IDENTIFIER=email \
  --set SESSION_STRATEGY=http_only_cookie
```

Then run:

```bash
npm run docs:all
npm run pack:review -- auth-standard
```

Resolve project-specific defaults/questions, then:

```bash
npm run pack:review -- auth-standard --approve
npm run docs:all
```

## C. Customize locally

Edit imported project files normally. Do not edit the base snapshot. Project docs are now canonical.

## D. Check a newer pack

```bash
npm run pack:diff -- auth-standard --source ../path/to/auth-standard-new
npm run pack:upgrade -- auth-standard --source ../path/to/auth-standard-new
```

Review `.project-docs/pack-proposals/.../REPORT.md` and rendered upstream files.

## E. Apply safe upgrade

When no conflicts/deletions remain:

```bash
npm run pack:upgrade -- auth-standard --source ../path/to/auth-standard-new --apply
npm run docs:all
```

If a conflict was manually/semantically merged into local files, explicitly acknowledge it:

```bash
npm run pack:upgrade -- auth-standard --source ../path/to/auth-standard-new --apply --accept-local-merge
```

Then review and approve the upgraded pack again.
