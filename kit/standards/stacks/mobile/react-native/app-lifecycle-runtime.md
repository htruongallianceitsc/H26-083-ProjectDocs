# App Lifecycle Runtime Standard

## States to reason about
`cold_start`, `active`, `inactive`, `background`, `warm_resume`, `process_recreated`.

## Rules
Every long-lived subsystem must define background and resume behavior:

| Runtime | Background | Resume |
|---|---|---|
| API/server cache | pause unnecessary work | refetch stale data by policy |
| socket/realtime | suspend/disconnect by policy | single reconnect + rejoin + reconcile |
| auth/session | keep secure session | validate only when policy requires |
| sync queue | OS-constrained | resume and reconcile |
| notifications | receive/store intent | navigate/reconcile after router ready |

- Resume handling must be idempotent and debounced.
- Network-online and app-resume events can arrive together; coordinate them through one reconciliation runtime.
- Never create duplicate socket connections, duplicate room joins or duplicate sync jobs after resume.
