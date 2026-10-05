# Brownfield Source Normalization Plan

This plan is advisory until converted into a reviewed WorkPlan. Never move source automatically from heuristic output.

## Current roots

## Proposed canonical roots

- `apps/` — deployable applications
- `packages/` — shared libraries/packages
- `tests/` — cross-application tests where appropriate
- `infra/` — infrastructure/deployment/database assets

## Move proposals

| From | To | Reason | Risk |
|---|---|---|---|

## Required updates

- Imports/project references
- Build scripts/workspace configuration
- CI/CD paths
- Docker/deployment paths
- Test runner paths
- Source Profile/Application roots

## Verification

- Build
- Automated tests
- `source:check`
- `source:scan`
- `doctor`
- `qa`
