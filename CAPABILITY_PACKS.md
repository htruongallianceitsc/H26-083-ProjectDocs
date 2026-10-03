# Capability Packs — Quick Reference

Starter Kit v3 supports reusable, versioned documentation capabilities without making shared Markdown the project source of truth.

## Model

```text
Starter Core
    +
Capability Pack Library
    ↓ preview/import
Project-local canonical docs
    ↓ customize
base + local + upstream
    ↓ three-way review
safe upgrade
```

## Included sample

`reusable-modules/auth-standard/` is a runnable reference pack.

Required features:

- Login
- Logout
- Forgot Password
- Reset Password

Optional features:

- Register
- Google Login
- Email Verification

## Import

```bash
cd tools
npm run pack:validate
npm run pack:import -- ../reusable-modules/auth-standard
npm run pack:import -- ../reusable-modules/auth-standard -- \
  --apply \
  --features register,google-login \
  --set LOGIN_IDENTIFIER=email \
  --set SESSION_STRATEGY=http_only_cookie
```

Import is preview-first. The second command changes nothing. `--apply` is required to create project files.

## Review

```bash
npm run pack:review -- auth-standard
npm run pack:review -- auth-standard --approve --note "Reviewed by Product + Tech Lead"
```

When `blockOnPackReviewPending` is enabled, pending pack review blocks documentation validation/implementation readiness.

## Upgrade

```bash
npm run pack:diff -- auth-standard --source ../path/to/auth-standard-new
npm run pack:upgrade -- auth-standard --source ../path/to/auth-standard-new
```

The upgrade command creates a proposal by default. It does not overwrite project files.

Apply safe changes only:

```bash
npm run pack:upgrade -- auth-standard --source ../path/to/auth-standard-new --apply
```

If both local and upstream changed the same entity, merge/review the project-local file first. Only then acknowledge the merge explicitly:

```bash
npm run pack:upgrade -- auth-standard --source ../path/to/auth-standard-new --apply --accept-local-merge
```

## Governance state

- `.project-docs/packs.lock.json` — provenance/version/features/variables/code map.
- `.project-docs/pack-snapshots/` — immutable rendered base snapshots.
- `.project-docs/pack-proposals/` — generated upgrade proposals.

No secrets belong in any of these files.

See `standards/reuse/capability-pack-standard.md` and `workflows/12-capability-pack-lifecycle.md`.
