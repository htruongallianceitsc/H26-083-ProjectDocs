---
code: API-AUTH-LOGIN
type: api
title: Login API
status: draft
owner: {{OWNER}}
created_at: {{IMPORT_DATE}}
updated_at: {{IMPORT_DATE}}
last_reviewed_at: {{IMPORT_DATE}}
method: POST
path: {{AUTH_API_PREFIX}}/login
tags: [auth, reusable-capability, security-sensitive]
related:
  features: [FEAT-AUTH-LOGIN]
  requirements: [REQ-AUTH-LOGIN-001]
  tests: [TC-AUTH-LOGIN-001]
---

# Login API

## Purpose

Validate credentials and create the project-approved authenticated session.

## Contract Notes

Request/response DTOs are intentionally not frozen by the reusable pack. They must be defined by the selected backend stack and project security decisions.

## Security

Apply rate limiting, non-enumerating errors, sensitive-field masking, audit policy and session/token protections defined by the project.
