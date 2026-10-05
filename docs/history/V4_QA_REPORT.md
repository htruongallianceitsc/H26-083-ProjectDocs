# V4 QA Report

Validated on Node.js 22 with no third-party npm dependencies.

## Base starter
- Pack manifests: 2 valid / 0 errors.
- Documentation validation: 0 errors / 0 warnings.
- Static site link check: 0 broken links.
- Pattern Pack preview: variable substitution and destination mapping passed.
- Capability Pack namespace preview: stable-code/path remap passed.

## Real-profile disposable workspace
Profile: mobile + api / react-native + dotnet-core-api + postgresql.

- AUTH Capability Pack imported with Register + Google Login.
- Pending pack review correctly blocked validation.
- Approval removed the gate.
- Full pipeline after approval: 0 errors / 0 warnings.
- Imported typed entities: 32.
- Typed relation edges: 79.
- Static site broken links: 0.

## Upgrade safety
- Local project changed Login feature.
- Upstream 1.1 changed the same Login feature and Logout API.
- Diff classified Login as `conflict` and Logout API as `upstream-only`.
- `pack:upgrade --apply` refused to overwrite while conflict remained.
