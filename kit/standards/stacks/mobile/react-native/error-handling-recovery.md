# Error Handling and Recovery

## Normalized error classes
Use a stable application taxonomy such as `Validation`, `Authentication`, `Authorization`, `Network`, `Timeout`, `Server`, `Cancelled`, `Unexpected`. External library error shapes must not leak through the UI boundary.

## Recovery contract
For every user-visible failure define:
- retry eligibility;
- automatic vs manual retry;
- data preservation;
- fallback screen/state;
- logout/session invalidation behavior;
- telemetry category.

## Error boundaries
Use route/screen-level fallback boundaries for unexpected render/runtime failures. A boundary must offer a safe recovery path and must not expose raw stack traces or secrets to users.
