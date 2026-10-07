# New Architecture and Native Module Standard

## Baseline
Production React Native source bases target the React Native New Architecture. Do not assume Legacy Architecture fallback is available.

## Dependency admission checklist
Before adding a native dependency verify:
1. compatibility with the selected Expo SDK / React Native baseline;
2. New Architecture compatibility;
3. whether a config plugin/prebuild is required;
4. supported iOS/Android versions;
5. lifecycle/background behavior;
6. privacy/permission declarations;
7. effect on runtimeVersion / OTA compatibility;
8. maintenance status and replacement plan.

Unverified native libraries are not allowed in the production baseline.
