# Metadata Schema

Entity frontmatter được validator kiểm theo `registry/frontmatter-schema.json` và `registry/entity-types.json`.

```yaml
---
uid: <permanent-uuid>
code: <stable-human-id>
revision: 1
type: <entity-type-from-registry>
title: <title>
status: draft
owner: <team/person>
created_at: YYYY-MM-DD
updated_at: YYYY-MM-DD
last_reviewed_at: YYYY-MM-DD
reviewers: []
tags: []
blocking: false              # open-question only when relevant
route: /example              # screen/deep-link when relevant
method: POST                 # api when relevant
path: /api/example           # api when relevant
related:
  modules: []
  features: []
  requirements: []
  business_rules: []
  screens: []
  flows: []
  apis: []
  database_objects: []
  tests: []
  decisions: []
  integrations: []
  nfrs: []
  runbooks: []
  permissions: []
  native_capabilities: []
  deep_links: []
  push_events: []
  local_storage: []
  sync_policies: []
  background_jobs_mobile: []
  analytics_events: []
  feature_flags: []
  device_test_profiles: []
  open_questions: []
  releases: []
---
```

## Rules
- `uid` is the permanent machine identity; `code` is the stable human-readable reference.
- New typed entities must receive a UUID and `revision: 1`; legacy entities may be backfilled with `entity:identity-backfill`.
- Status changes performed by tooling must follow configured lifecycle transitions in `registry/entity-types.json`.
- `type` và `status` phải tồn tại trong entity registry.
- Relation key phải tồn tại trong relation map và target code phải resolve được.
- Relation phải hợp lệ cho source type -> relation key -> target type và cardinality.
- Không link chỉ vì cùng domain/name. Link phải có evidence nghiệp vụ/technical cụ thể.
- Validator cảnh báo hub/degree bất thường để giảm over-link.

## Progressive Specification fields (Feature)

```yaml
spec_level: lightweight       # lightweight | standard | full | auto
target_maturity: prototype    # concept | prototype | uat | production
```

These fields are independent from `status`. If omitted, project defaults from `project.profile.json` apply.
