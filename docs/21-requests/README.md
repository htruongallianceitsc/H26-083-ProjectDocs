# Requests

`docs/21-requests/` stores durable project requests before they are promoted into canonical Feature, Requirement, Bug, Task, Decision, or other project documentation.

A Request is the traceable origin of change, not a replacement for canonical specifications.

Lifecycle:

```text
captured -> analyzed -> accepted/rejected -> promoted -> closed
```

Use:

```bash
cd tools
npm run request:create -- --title "Add Google login" --kind change --summary "Allow users to sign in with Google."
npm run request:list
npm run request:promote -- --request REQST-YYYYMMDD-001 --target FEAT-AUTH-GOOGLE
```

Rules:

- Capture the request before changing durable project scope when provenance matters.
- Create/update canonical documentation before promotion.
- `promoted_to` points to the durable entity/entities that implement the accepted request.
- Do not leave accepted/promoted requests without a promotion target.
