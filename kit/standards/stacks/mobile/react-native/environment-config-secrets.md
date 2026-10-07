# Environment Configuration and Secrets

## Classes
- build secret;
- server-only secret;
- client-visible runtime/build configuration;
- environment identifier;
- public provider key.

## Rules
- Anything bundled into the mobile client must be treated as public, including `EXPO_PUBLIC_*`.
- Backend credentials/private secrets must never be shipped in the app.
- Development, preview/UAT and production configuration are explicit environments.
- Build profiles must not silently inherit production credentials.
- Environment selection is build/release configuration, not a hidden UI toggle in production.
- Configuration validation occurs during bootstrap and fails clearly for missing required public values.
