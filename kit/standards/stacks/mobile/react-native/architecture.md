# React Native Architecture Standard

## Purpose
Define the mandatory architecture boundaries for production React Native applications. The source tree is not the architecture; dependencies between layers are.

## Required boundaries

```text
src/app       -> features, core, shared
src/features  -> core, shared
src/core      -> shared
src/shared    -> no feature/app imports
```

- `app/` owns route adapters and navigation composition only.
- `features/` owns product behavior and feature-specific UI.
- `core/` owns cross-cutting runtime adapters such as bootstrap, network, session, storage, connectivity, notifications, analytics and logging.
- `shared/` owns reusable UI primitives, types, utilities and constants that have no product-feature ownership.
- Feature A must not import Feature B internals. Cross-feature collaboration must use an explicit public contract or core service.
- Native APIs are accessed through adapters; feature code must not scatter platform-specific calls.

## Data flow
Prefer one-way flow: route -> feature screen -> feature/application logic -> core adapter -> external/native system. Normalize errors and data at boundaries.

## Required evidence
Document deviations with an ADR. Production features must link relevant Screen/API/Test/mobile-runtime contracts before implementation readiness.
