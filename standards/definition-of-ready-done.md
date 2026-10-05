# Definition of Ready / Done — v5.1

## Documentation Ready — before WorkPlan submission

A Feature is Ready only when the configured machine gate passes.

Default minimum:

- Feature status is compatible with implementation planning.
- At least one linked Requirement exists.
- At least one linked Test Case exists.
- Linked Requirements are `approved` or `implemented`.
- Linked Tests are `ready` or `passed`.
- No linked Open Question is `open` or `blocked`.
- Imported reusable packs have approved review state when the profile requires it.

Human review should additionally confirm, when applicable:

- Feature scope, actors, preconditions and flows are clear.
- Business Rules are identified.
- Screen/Flow contracts are adequate for UI work.
- API contract is adequate for backend work.
- DB impact is adequate for persistence changes.
- Security/permission/NFR implications are explicit.
- Acceptance criteria are testable.
- Blueprint and traceability are current.

Command:

```bash
cd tools
npm run gate:ready -- --feature FEAT-...
```

## WorkPlan Ready

A WorkPlan is reviewable when:

- target Feature passes Documentation Ready;
- task breakdown is deterministic and linked to canonical entities;
- assumptions, risks and acceptance criteria are explicit;
- `requiresAuthoring=false`;
- submission captures the current documentation context hash.

Approval must fail if that hash becomes stale.

## Documentation Done — after implementation/reconciliation

Default machine minimum:

- Feature status is `implemented`.
- linked Feature tests are `passed`.
- at least one incoming Task exists.
- all incoming Tasks are `done`.
- no linked Open Question is `open` or `blocked`.

Human review should additionally confirm:

- released/implemented behaviour matches canonical docs;
- Route/API/DB inventories are current;
- monitoring/runbook/release notes are updated when impacted;
- Decisions are recorded instead of rewriting history;
- no known stale documentation remains from the change.

Command:

```bash
npm run gate:done -- --feature FEAT-...
```


## v5.1 Freshness Gate

For a reconciled Feature, known `STALE` dependency state blocks both Ready and Done. `UNTRACKED` remains non-blocking for progressive adoption. After implementation changes linked tests/contracts, review and reconcile the Feature before Done.
