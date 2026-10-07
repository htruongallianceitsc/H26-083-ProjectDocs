# State and Data Ownership Contract

## Decision table

| Data | Default owner | Persistence |
|---|---|---|
| API query/result | server-state cache | cache policy |
| form draft | feature/UI | optional explicit draft |
| auth session token | session adapter | secure storage |
| app theme/locale | client settings | normal local storage |
| router location | Expo Router | router-managed |
| socket connection | realtime runtime | never as UI state |

## Required documentation
For non-trivial state document owner, reset trigger, persistence, TTL/freshness, offline behavior and reconciliation behavior.
