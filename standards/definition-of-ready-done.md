# Definition of Ready / Done — v5.2

## Mode-aware Documentation Ready

A Feature is Ready only when the configured machine gate passes for its **effective specification level**.

Common checks:

- Feature status permits implementation planning.
- No linked Open Question is `open` or `blocked`.
- Imported reusable packs have approved review state when required.
- Known stale dependency state is not blocking.
- Risk/maturity policy is respected.

Profile-specific minimums are defined in `registry/spec-profiles.json`:

### Lightweight

- Goal / purpose is documented.
- Actors are documented.
- Main Flow is documented.
- Key Rules are documented.
- Acceptance is documented.
- Separate Requirement/Test entities are not required by default.

### Standard

- At least one linked Requirement exists.
- At least one linked Test Case exists.
- Linked Requirements are `approved` or `implemented`.
- Linked Tests are `ready` or `passed`.

### Full

- Standard requirements apply.
- NFR coverage is explicitly linked.
- Error/failure behaviour, audit/observability, edge cases and security/privacy review are documented.

Command:

```bash
cd tools
npm run spec:check -- --feature FEAT-...
npm run gate:ready -- --feature FEAT-...
```

## WorkPlan Ready

A WorkPlan is reviewable when:

- target Feature passes the mode-aware Documentation Ready gate;
- task breakdown is deterministic and linked to canonical entities;
- assumptions, risks and acceptance criteria are explicit;
- `requiresAuthoring=false`;
- effective spec level, maturity and recommendation are snapshotted;
- submission captures the current documentation context hash.

Approval must fail if that hash becomes stale.

## Documentation Done

Common machine minimum:

- Feature status is `implemented`.
- all incoming implementation Tasks are `done`.
- no linked Open Question remains blocking.
- known stale documentation is reconciled.

If linked tests exist, they must satisfy the configured Done status rules. Standard/Full normally have explicit linked tests because their Ready profiles require them.

Human review should confirm that implemented/released behaviour matches the selected depth and current maturity. A Lightweight prototype can be Done at prototype maturity without pretending to be production-ready.

```bash
npm run gate:done -- --feature FEAT-...
```

## Promotion readiness

When maturity/risk increases, do not reinterpret the previous Lightweight spec as production-complete. Generate the target-level gap report and resolve it before promotion:

```bash
npm run spec:promote -- --feature FEAT-... --to standard
```
