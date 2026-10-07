# State Management

## Ownership classes
Every state value must have one owner class:

- **UI local state**: component/hook lifecycle.
- **Feature/client state**: cross-component product state that is not remote truth.
- **Server state**: remote data, cache freshness, retry and invalidation.
- **Persisted state**: preferences or recoverable local state with migration policy.
- **Sensitive persisted state**: secure storage only.
- **Navigation state**: router-owned.
- **Native state**: accessed through a core adapter.

## Rules
- Do not mirror server state into a global client store without a documented reason.
- Global stores require ownership, reset/logout behavior and persistence policy.
- One-time UI events must not be modeled as durable state.
- Persisted schemas require version/migration/corruption recovery.
- Logout/account switch must define which stores are cleared, retained or re-keyed.
