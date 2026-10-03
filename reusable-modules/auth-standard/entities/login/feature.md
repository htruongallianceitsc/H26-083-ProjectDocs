---
code: FEAT-AUTH-LOGIN
type: feature
title: Login
status: draft
owner: {{OWNER}}
created_at: {{IMPORT_DATE}}
updated_at: {{IMPORT_DATE}}
last_reviewed_at: {{IMPORT_DATE}}
tags: [auth, reusable-capability, security-sensitive]
related:
  modules: [MOD-AUTH]
  requirements: [REQ-AUTH-LOGIN-001]
  screens: [SCR-AUTH-LOGIN]
  apis: [API-AUTH-LOGIN]
  tests: [TC-AUTH-LOGIN-001]
  decisions: []
  open_questions: []
---

# Login

## Overview

Authenticate a user using `{{LOGIN_IDENTIFIER}}` and establish a session using `{{SESSION_STRATEGY}}`.

## Main Flow

1. User opens `{{AUTH_ROUTE_PREFIX}}/login`.
2. User enters identifier and credential.
3. Client calls `POST {{AUTH_API_PREFIX}}/login`.
4. Server validates credentials and returns the project-approved session result.
5. Client routes to the authorized post-login destination.

## Error / Exception Flows

Invalid credentials must use a non-enumerating error response. Locked, disabled or unverified accounts follow project-local rules.

## Security

- Never log passwords, tokens or secrets.
- Rate limiting and brute-force protections must be defined by the target API project.
- Session lifetime and refresh policy must be confirmed by a project ADR or security standard.

## Open Questions

Review the imported pack variables and replace generic assumptions with project decisions before implementation.
