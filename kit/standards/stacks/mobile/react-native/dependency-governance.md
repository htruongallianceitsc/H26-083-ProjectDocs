# React Native Dependency Governance

## Canonical catalog
`kit/registry/react-native-dependency-catalog.json` is the starter baseline for Expo/React/React Native compatibility and approved dependency categories.

## Rules
- Core Expo, React and React Native versions move as a reviewed compatibility set.
- Use `npx expo install` for Expo-managed native dependencies unless the library explicitly requires another installation path.
- Run `npm run source:dependency-check` and `npx expo-doctor` during dependency upgrades.
- Do not auto-upgrade native dependencies in unattended dependency bots without build/device verification.
- Record an ADR when choosing a discouraged/non-standard package for a cross-cutting concern.
- Re-review dependencies on Expo SDK upgrade, native build failure, New Architecture warning or store-target change.
