# Source Base Governance

A Source Base is a versioned bootstrap skeleton, not a continuously linked dependency.

1. Select a Source Profile.
2. Materialize a Source Base variant with `source:init`.
3. Record provenance in `.project-docs/source.lock.json`.
4. Treat the copied application source as canonical after initialization.
5. Never auto-overwrite project source from a newer Source Base.
6. Use `source:upgrade-check` to discover a newer base and create a reviewed migration WorkPlan if an upgrade is wanted.
7. Business/domain features belong in project docs or Capability Packs, not in generic Source Bases.
8. Keep Source Bases free of dependency caches, secrets, build output and generated binaries.
