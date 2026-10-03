---
code: TC-AUTH-LOGIN-001
type: test-case
title: Login with valid and invalid credentials
status: draft
owner: {{OWNER}}
created_at: {{IMPORT_DATE}}
updated_at: {{IMPORT_DATE}}
last_reviewed_at: {{IMPORT_DATE}}
tags: [auth, reusable-capability]
related:
  features: [FEAT-AUTH-LOGIN]
  requirements: [REQ-AUTH-LOGIN-001]
  screens: [SCR-AUTH-LOGIN]
  apis: [API-AUTH-LOGIN]
---

# Login Test Case

## Preconditions

A valid test user exists and authentication service is available.

## Scenarios

1. Valid identifier + valid credential -> authenticated session.
2. Valid identifier + invalid credential -> rejected without session.
3. Unknown identifier -> rejected without user enumeration.
4. Repeated failure -> project-specific throttling/lock behavior is verified.
