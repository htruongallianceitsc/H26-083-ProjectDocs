---
code: BR-AUTH-001
type: business_rule
title: Disabled users cannot login
status: approved
related:
  features: [FEAT-AUTH-LOGIN]
  apis: [API-AUTH-LOGIN]
---
# Business Rule

If `User.IsDisabled = true`, authentication must be rejected even when credentials are correct.
