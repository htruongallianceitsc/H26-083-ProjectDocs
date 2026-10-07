# v5.17 Upgrade Notes - Mobile Reuse Pack Library

## Objective
Make recurring mobile concerns reusable through governed documentation packs after the v5.16 runtime standards are in place.

## Added / upgraded
- `auth-standard@1.1.0`: optional session restore, single-flight token refresh and secure-session storage.
- `push-notification-standard@1.0.0`.
- `file-media-upload@1.0.0`.
- 8 mobile runtime Pattern Packs: app bootstrap, API auth refresh, async screen state, list pagination/refresh, lifecycle reconciliation, connectivity-aware query, secure session storage, socket reconnect/rejoin.
- mobile reuse selection guide/workflow.

## Non-goal
Packs import documentation contracts only. They do not emit React Native feature implementation code.
