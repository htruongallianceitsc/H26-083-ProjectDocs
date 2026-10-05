---
code: NFR-SEC-001
type: nfr
title: Session Token Lifetime
status: draft
owner: Engineering Lead
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [security, auth]
related:
  modules: [MOD-AUTH]
  features: []
  requirements: []
  business_rules: []
  screens: []
  flows: []
  apis: [API-AUTH-LOGIN]
  database_objects: [DB-REFRESH-TOKEN]
  tests: []
  decisions: [ADR-002]
---

# Non-Functional Requirement

## Category
Security

## Requirement
Session credentials must expire within bounded windows to limit the blast radius of a leaked token.

## Metric
Token lifetime configuration.

## Target
JWT access token: 15 minutes. Refresh token: 30 days, revoked immediately on logout (`API-AUTH-LOGOUT`).

## Measurement Method
Configuration review; verified by `TC-AUTH-LOGIN-001`-adjacent tests that an expired access token is rejected.

## Scope
`MOD-AUTH` session issuance (`ADR-002`).

## Failure Threshold
Any token issued with a longer lifetime than specified here is a security regression and must be fixed before release.

## Verification / Test
Unit test asserting the JWT `exp` claim and the `refresh_tokens.expires_at` value match these targets.
