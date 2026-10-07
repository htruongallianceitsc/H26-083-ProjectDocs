# React Native Testing and Release Standard

## Test layers
- unit tests for pure/domain logic;
- component tests for reusable/feature UI;
- integration tests for API/session/storage adapters;
- device/E2E coverage for critical flows;
- release smoke coverage on representative iOS/Android devices.

## Mandatory transition coverage for production apps
- cold start and warm resume;
- offline -> online;
- valid -> expired session;
- permission granted/denied/revoked when used;
- deep link cold/warm launch when used;
- push foreground/background/terminated when used;
- socket reconnect/rejoin when realtime is used.

## Release gate
Typecheck, dependency compatibility, docs/traceability gates, device profile, critical E2E, signing/build profile and OTA/runtimeVersion compatibility must be reviewed before store release.
