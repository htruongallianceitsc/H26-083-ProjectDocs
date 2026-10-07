# Storage and Networking Integration

This standard coordinates the detailed `network-api-client`, `state-and-data-ownership`, lifecycle and mobile storage standards.

## Rules
- Secrets/session credentials use an approved secure-storage adapter.
- Normal preferences/cache use an explicitly selected local-storage technology.
- Stored data has classification, schema/key ownership, migration, eviction/TTL and logout/account-switch rules.
- Networking uses the shared API client and connectivity runtime.
- Offline writes require an explicit `sync-policy`; never hide an offline mutation queue inside generic networking code.
- Corrupt storage must have recovery behavior that does not permanently brick startup.
