# Source Base Library

Versioned application skeletons used only to bootstrap source workspaces.

Rules:

- Source Base is not project source of truth after materialization.
- `source:init` copies a selected variant into the target application root.
- Provenance is locked in `.project-docs/source.lock.json`.
- Never edit an application by editing its Source Base.
- Upgrades are reviewable migrations; they never overwrite project source automatically.
- `node_modules`, build output, Pods, Gradle caches and generated artifacts must never be committed into Source Bases.

Native iOS/Android bases are structural starter skeletons and intentionally omit generated IDE/cache artifacts. Teams may materialize them and then use their normal Xcode/Gradle tooling without changing the Application boundary/provenance model.
