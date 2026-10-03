# Reusable Capability Pack Library

Capability Packs are versioned documentation assets for repeated capabilities such as AUTH, User Profile, File Upload, Notification, Audit Log or Common CRUD.

They are **not runtime shared documentation**. Import a pack into a project; after import, project-local files become canonical. The pack lock keeps provenance and the imported base snapshot so upgrades can be reviewed with a three-way diff.

## Commands

```bash
cd tools
npm run pack:validate -- ../reusable-modules/auth-standard
npm run pack:import -- ../reusable-modules/auth-standard
npm run pack:import -- ../reusable-modules/auth-standard -- --apply --features register,google-login --set LOGIN_IDENTIFIER=email
npm run pack:diff -- auth-standard --source ../reusable-modules/auth-standard
npm run pack:upgrade -- auth-standard --source ../reusable-modules/auth-standard
```

`pack:import` without `--apply` is always a preview. `pack:upgrade` without `--apply` only creates an upgrade proposal.
