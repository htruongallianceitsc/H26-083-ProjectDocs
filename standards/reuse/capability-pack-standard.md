# Capability Pack Reuse Standard

## Purpose

Define how repeated software capabilities are packaged, imported, customized and upgraded without turning shared documentation into an ambiguous runtime source of truth.

## Three-layer model

1. **Starter Core** — registry, standards, templates, workflows, project profile and tooling.
2. **Capability Pack Library** — versioned reusable capability baselines such as AUTH, User Profile, File Upload, Notification, Audit Log and Common CRUD.
3. **Project Workspace** — imported project-local canonical documents customized to actual product requirements.

A project must never rely on library Markdown as its live business source of truth. Once imported, project-local files govern implementation and traceability.

## Pack identity and versioning

Every pack must have a `manifest.json` containing at least:

- `packageId` — globally stable lowercase package identity.
- `version` — semantic version `MAJOR.MINOR.PATCH`.
- `starterSchemaRange` — compatible starter schema range.
- `moduleCode` — default root module stable code.
- required/optional feature inventory.
- variables and validation rules.
- dependency declarations.
- canonical pack file inventory.
- provenance.
- upgrade policy.

Use semantic versioning:

- **PATCH** — clarification/fix that does not change capability semantics.
- **MINOR** — backward-compatible new optional feature, requirement, test or documentation enhancement.
- **MAJOR** — breaking rule/contract/identity change that requires explicit migration review.

## Variables

A variable is suitable only when projects legitimately vary by configuration. Typical examples:

- route/API prefix;
- identifier type;
- registration mode;
- session strategy;
- optional integration policy.

Do not put secrets into pack variables. Do not freeze environment URLs, API keys, passwords, certificates, concrete retention periods or legal copy into a reusable baseline.

Variables with security/product consequences must use `reviewRequired: true`.

## Optional features

Optional features must be declared explicitly in the manifest. Import tools must:

1. select required + enabled optional features;
2. exclude files belonging to disabled features;
3. prune relations to disabled pack entities;
4. never silently retain dangling references.

## Stable codes and namespace remap

Default import preserves stable pack codes. If a project needs another namespace, use deterministic remapping rather than manual search/replace.

Example:

```text
FEAT-AUTH-LOGIN
    --namespace INTERNAL
FEAT-INTERNAL-AUTH-LOGIN
```

The project pack lock must store the complete code map used during import.

## Provenance and pack lock

Pack provenance is governance metadata, not a product/business fact. Store it in:

```text
.project-docs/packs.lock.json
.project-docs/pack-snapshots/<package>/<version>/
```

Do not add `packageVersion`, source commit or import path to business entity frontmatter unless the project explicitly needs that fact for another reason.

The lock must record:

- package/version;
- selected features;
- resolved non-secret variables;
- namespace/code map;
- target root;
- source-to-project file map;
- base hashes/snapshot paths;
- upgrade policy;
- pack review status/history.

## Import workflow

`pack:import` must be preview-first.

1. Validate pack.
2. Resolve required/optional features.
3. Resolve/validate variables.
4. Render deterministic code remap.
5. Prune disabled relations.
6. Check file/code collisions.
7. Show preview.
8. Apply only with explicit `--apply`.
9. Write immutable base snapshot and pack lock.
10. Set pack review to `pending` unless explicitly approved.
11. Run project profile/validation/traceability/site build.
12. Project owner reviews defaults/questions and runs `pack:review --approve`.

## Upgrade workflow

Never overwrite project files directly from upstream.

For each imported source file compare:

- **base** — rendered pack file at the version originally imported;
- **local** — current project-local customized file;
- **upstream** — rendered file from the new pack version.

Classify changes:

- `unchanged` — no side changed;
- `upstream-only` — safe upstream update candidate;
- `local-only` — project customization only;
- `converged` — local already equals upstream;
- `conflict` — both changed differently;
- `added` — new upstream file;
- `upstream-deleted` / delete conflict — always manual review.

`pack:upgrade` creates a proposal by default. It may apply only safe changes with explicit `--apply`. Conflicts require human/AI semantic review. `--accept-local-merge` is allowed only after the merged local result has been explicitly reviewed.

After applying an upgrade:

- create a new base snapshot for the upstream version;
- update lock version/hashes;
- keep local customizations;
- set pack review back to `pending`;
- run validation and full documentation build.

## What must not be reused blindly

At minimum, review locally:

- password/session duration;
- password/MFA/security policy;
- RBAC roles/permissions;
- sender identity and legal/compliance copy;
- tenant/domain restrictions;
- environment URLs/secrets;
- analytics/tracking configuration;
- retention/deletion policy;
- store/privacy declarations;
- infrastructure sizing and availability targets.

Model these as pack variables, project Open Questions, ADRs, Requirements or NFRs as appropriate.

## Quality gates

Projects using packs should enable:

- unknown entity/relation validation;
- file/code collision detection;
- pack snapshot existence check;
- pack code drift check;
- `PACK_REVIEW_PENDING` implementation gate;
- normal typed traceability and stale dependency checks after import/upgrade.

## Pack design rule

A reusable pack should describe **capability invariants and safe defaults**, not pretend every product has the same detailed implementation. Keep project-specific rules out of the pack or explicitly surface them for review.
