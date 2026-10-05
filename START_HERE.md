# START HERE — v5.4

## 1. Decide documentation maturity

Configure `project.profile.json` with project type, technology stacks, default Spec Level and target maturity.

## 2. Decide application boundaries

A deployable application should have an `application` entity. Typical examples:

- `APP-WEB` → React SPA or Next.js
- `APP-API` → ASP.NET Core / Node.js API
- `APP-MOBILE` → React Native / Flutter
- `APP-IOS` / `APP-ANDROID` → native mobile apps

## 3. Bootstrap or adopt source

New project:

```bash
cd tools
npm run source:list
npm run source:init -- --code APP-WEB --profile react-spa --variant production
```

Existing project:

```bash
npm run source:adopt -- --code APP-WEB --profile react-spa --root frontend
```

`source:init` copies a versioned Source Base. `source:adopt` registers existing code in place. Both create an Application entity and source provenance lock.

## 4. Build documentation first

Create/confirm Module → Feature → Requirements/Rules → Screen/API/DB/Test as required by the selected Spec Level. Add `related.applications` to Features that have an implementation boundary.

## 5. Check readiness and source workspace

```bash
npm run source:check
npm run spec:check -- --feature FEAT-...
npm run gate:ready -- --feature FEAT-...
```

## 6. Create reviewed WorkPlan

`plan:scaffold` now snapshots `applicationScope`, so implementation tasks know which app boundary they belong to.

## 7. Implement and reconcile

Implement only against the approved WorkPlan, then reconcile docs/freshness and pass the Done Gate.

## 8. Never auto-upgrade Source Base

Use `source:upgrade-check`. A Source Base upgrade is a reviewed migration, not an overwrite operation.

## 9. Run full QA

```bash
npm run qa
```
