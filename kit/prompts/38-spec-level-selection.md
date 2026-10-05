# Prompt 38 — Select Documentation Depth

Evaluate the project/Feature and recommend `lightweight`, `standard`, or `full` documentation depth.

Consider:
- current target maturity: concept / prototype / UAT / production;
- security, authentication/authorization and privacy sensitivity;
- financial/payment behaviour;
- destructive database/data migration risk;
- third-party integrations;
- complexity and uncertainty;
- whether the user explicitly wants a mock/POC.

Return:
1. requested/default level;
2. recommended level;
3. reasons and risk signals;
4. minimum documents needed now;
5. what may be deferred safely;
6. what must be added before promotion to the next maturity.

Do not silently expand a Lightweight request into a Full document set unless risk policy requires it.
