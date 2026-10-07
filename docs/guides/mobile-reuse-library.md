# Mobile Reuse Library

## Selection

```text
Rule the team must follow -> Standard
Stable reusable capability -> Capability Pack
Repeated implementation shape -> Pattern Pack
Project-specific behavior -> canonical project docs only
```

## Recommended React Native starting set
- AUTH app: `auth-standard` plus only needed mobile optional features.
- Push: `push-notification-standard`.
- Attachments: `file-media-upload`.
- Runtime patterns: app bootstrap, auth refresh, async screen state, pagination, lifecycle reconciliation, connectivity-aware query, secure session storage and socket reconnect/rejoin as applicable.

Preview first:

```bash
cd tools
npm run pack:list
npm run pack:import -- ../kit/reuse/patterns/app-bootstrap
```

Apply only after reviewing destinations/variables. Imported docs become project-local canonical content and require explicit pack review before Ready Gate.
