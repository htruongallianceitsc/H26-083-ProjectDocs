---
code: TC-AUTH-LOGIN-002
type: test_case
title: Disabled user cannot login
status: approved
related:
  verifies: [REQ-AUTH-001, BR-AUTH-001]
---
# Test Case

1. Given a disabled user with correct credentials.
2. Submit login.
3. Expect authentication rejection.
4. Verify no token/session is created.
