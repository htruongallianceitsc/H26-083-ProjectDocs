# Project Structure and Boundaries

## Default production structure

```text
src/
  app/
  features/
  core/
    bootstrap/
    config/
    errors/
    network/
    session/
    storage/
    connectivity/
    notifications/
    deeplink/
    analytics/
    logging/
    feature-flags/
  shared/
    ui/
    hooks/
    types/
    utils/
```

## Feature structure
A feature may contain `api/`, `components/`, `hooks/`, `model/`, `screens/` and `tests/`. Do not create empty folders only to satisfy a convention.

## Public contract
If another feature needs behavior from a feature, expose a deliberate public entry point instead of importing nested implementation files.

## Route rule
`src/app` may import a feature screen. A feature screen must not import Expo Router directly unless navigation is itself the feature boundary; prefer navigation commands passed through a small adapter/hook.
