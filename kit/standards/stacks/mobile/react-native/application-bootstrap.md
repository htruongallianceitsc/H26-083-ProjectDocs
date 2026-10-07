# Application Bootstrap Standard

## Required startup pipeline

```text
Native launch
 -> JS runtime
 -> crash/log bootstrap
 -> environment validation
 -> secure session restore
 -> local state/cache restore
 -> feature/remote configuration
 -> notification/deep-link initial intent capture
 -> session validation when policy requires
 -> APP_READY
 -> authenticated or public router
```

## Rules
- Bootstrap is an explicit state machine, never a collection of unrelated startup effects.
- Each step declares timeout/failure behavior and whether failure is blocking, recoverable or ignorable.
- Initial deep link/push intent must be captured before navigation readiness and consumed once.
- Session restoration and refresh must be single-flight.
- Re-running bootstrap after warm resume is forbidden; resume uses lifecycle reconciliation instead.
- Bootstrap telemetry must expose step duration and failure category without sensitive payloads.

## Required states
`starting`, `restoring`, `validating`, `ready`, `recoverable_error`, `fatal_error`.

## Verification
Test cold start online/offline, expired session, corrupt local state, invalid initial link, notification launch and bootstrap timeout.
