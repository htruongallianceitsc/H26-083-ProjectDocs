# Expo / Native Boundary

## Rules
- Prefer Expo-compatible APIs when they satisfy product requirements.
- Any dependency that adds native code requires compatibility review, config-plugin/prebuild impact review, permissions/privacy review and OTA/runtime-version review.
- Native APIs are wrapped by `core` adapters; feature code should not spread direct native-module calls.
- Custom native code requires an ADR and ownership/runbook.
- Continuous Native Generation/prebuild changes are reviewed as source changes, not regenerated blindly over manual native edits.
