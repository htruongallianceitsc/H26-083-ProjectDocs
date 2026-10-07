# React Native Production Readiness

## Goal
Move from documentation-only coverage to a reviewed implementation contract without generating feature code.

## Sequence
1. Set `projectTypes: [mobile]` and `technologyStacks: [react-native]`.
2. Run `profile:check`; review all applicable React Native standards.
3. Run `source:dependency-check` to confirm the bundled compatibility baseline.
4. Materialize `react-native-expo@2.0.0/production` with `source:init`.
5. Document only the mobile runtime entities actually used: permission, deep link, push event, local storage, sync policy, native capability, background job and device test profile.
6. Pass Ready Gate before authoring implementation tasks.
7. Use reviewed WorkPlans; this starter does not generate feature implementation code.

## Production boundary
The source base provides runtime seams and safe defaults. Product behavior remains canonical in docs and is implemented deliberately by the team.
