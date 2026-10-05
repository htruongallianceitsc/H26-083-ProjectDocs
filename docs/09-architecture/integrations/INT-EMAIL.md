---
code: INT-EMAIL
type: integration
title: Transactional Email Provider
status: draft
owner: Backend Team
created_at: 2026-10-05
updated_at: 2026-10-05
last_reviewed_at: 2026-10-05
tags: [integration, email]
related:
  modules: [MOD-AUTH, MOD-WORKSPACE]
  features: [FEAT-AUTH-FORGOT-PASSWORD, FEAT-WORKSPACE-MANAGE-MEMBERS]
  requirements: []
  business_rules: []
  screens: []
  flows: [FLOW-WORKSPACE-INVITE-MEMBER]
  apis: [API-AUTH-FORGOT-PASSWORD, API-WORKSPACE-INVITE-MEMBER]
  database_objects: []
  tests: []
  decisions: []
---

# External Integration

## Purpose
Deliver password-reset links and workspace-invite notifications by email.

## Provider / System
Not yet finalized — see `docs/19-open-items/open-questions.md` (`OQ-005`). Candidates include any standard transactional email API provider.

## Authentication
API key, configured per environment, never committed to source control (`standards/security-and-secrets.md`).

## Data Sent / Received
Sent: recipient email address, recipient display name, and a single-use link/token (reset token or invite context). Nothing is received back synchronously (fire-and-forget send).

## Trigger / Flow
Triggered by `API-AUTH-FORGOT-PASSWORD` (password reset) and `API-WORKSPACE-INVITE-MEMBER` (workspace invite, see `FLOW-WORKSPACE-INVITE-MEMBER`).

## Timeout / Retry / Backoff
Send is fire-and-forget relative to the triggering API request; the request does not wait on email delivery confirmation. Provider-side retry/backoff policy depends on the final provider chosen (`OQ-005`).

## Idempotency / Duplicate Handling
Not idempotent by design — each triggering event sends exactly one email; retried API calls (e.g. requesting another password reset) intentionally send another email with a new token.

## Failure Behaviour
If the email send fails, the triggering API request still succeeds (the token/membership row is already persisted); the failure is logged and, if persistent, surfaces as an operational alert (`docs/13-operations/monitoring.md`).

## Security / Privacy
Email addresses are personal data; only the minimum fields needed to compose the message are sent to the provider.

## Monitoring / Alerts
Send failures are logged; a sustained failure rate triggers an alert per `docs/13-operations/monitoring.md`.

## Sandbox / Production Configuration
Non-production environments use a sandbox/test mode (or a captured-mail tool) so no real emails are sent outside production, per `docs/12-devops/environments.md`.

## Related Features / APIs
`FEAT-AUTH-FORGOT-PASSWORD`, `FEAT-WORKSPACE-MANAGE-MEMBERS`, `API-AUTH-FORGOT-PASSWORD`, `API-WORKSPACE-INVITE-MEMBER`
