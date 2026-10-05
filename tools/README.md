# Documentation Toolchain v4

Requires Node.js 20+. No npm dependencies are required.

```bash
cd tools
npm run docs:all
npm run docs:serve
```

## Reuse commands

```bash
npm run pack:list
npm run pack:validate
npm run reuse:assess -- --name AUTH --occurrences 4 --similarity 0.8 --stability stable --security-baseline
npm run pack:import -- ../reusable-modules/auth-standard
npm run pack:import -- ../reusable-modules/auth-standard --apply --features register,google-login --set GOOGLE_LOGIN_ENABLED=true
npm run pack:review -- auth-standard --approve --note "Reviewed by Product and Tech Lead"
npm run pack:diff -- auth-standard --source ../../library/auth-standard-1.1.0
npm run pack:upgrade -- auth-standard --source ../../library/auth-standard-1.1.0
```

Import/upgrade are preview-first. Project-local docs become source of truth. Pack state and snapshots stay under `.project-docs/`.
