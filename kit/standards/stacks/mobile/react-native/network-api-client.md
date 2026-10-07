# Network and API Client Standard

## Mandatory client responsibilities
- environment-resolved base URL;
- request timeout and cancellation;
- correlation/request ID;
- normalized application errors;
- authentication header injection;
- single-flight token refresh;
- controlled retry/backoff with jitter;
- idempotency support where APIs permit it;
- connectivity-aware behavior;
- no sensitive request/response logging.

## 401 refresh rule

```text
401
 -> refresh already running?
    yes -> join existing refresh
    no  -> start one refresh
 -> success: replay eligible pending requests once
 -> failure: invalidate session and reject pending requests
```

Never allow multiple concurrent refresh requests for the same session. Do not blindly retry non-idempotent writes.

## Error taxonomy
At minimum normalize validation, authentication, authorization, network/offline, timeout, server and unexpected errors.
