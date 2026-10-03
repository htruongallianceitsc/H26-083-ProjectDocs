# START HERE — Từ ý tưởng đến documentation production-ready

## Phase 0 — Chọn project profile trước

1. Copy `PROJECT_PROFILE.example.json` -> `project-profile.json`.
2. Chọn một hoặc nhiều project type: `web`, `mobile`, `api`.
3. Chọn technology stack đúng implementation thật.
4. Chạy:

```bash
cd tools
npm run profile:check
```

5. Đọc standards theo thứ tự Core -> Project Type -> Stack -> Project ADR.

Không tạo technical design trước khi profile/standards được chọn nếu technology đã biết.

## 12 phase

| Phase | Mục tiêu | Output chính |
|---|---|---|
| 0 | Project profile | Applicable standards |
| 1 | Idea & Discovery | Overview, Scope, Glossary, Open Questions |
| 2 | Blueprint | Module/Feature/Route/API/DB inventory |
| 3 | Functional Detail | Requirement, Rule, Screen, Flow |
| 4 | Technical Contracts | API, DB, Integration, Architecture |
| 5 | Quality | Acceptance Criteria, Test, NFR |
| 6 | Production Readiness | Security, DevOps, Monitoring, Runbook |
| 7 | Governance | Decision, Traceability, Change/Release |
| 8 | Tooling | Validate, Sync, Static Site, Graph |
| 9 | Profile/Standards Audit | Project-type + stack compliance |
| 10 | Mobile Readiness | Lifecycle/offline/native/device readiness |
| 11 | Store Release Readiness | iOS/Android release/store/backward compatibility |
| 12 | Reusable Capability Packs | Import/customize/upgrade repeated modules safely |

## Workflow mapping

- `workflows/01-idea-to-scope.md`
- `workflows/02-scope-to-blueprint.md`
- `workflows/03-blueprint-to-functional-docs.md`
- `workflows/04-functional-to-technical-contracts.md`
- `workflows/05-quality-and-test.md`
- `workflows/06-production-readiness.md`
- `workflows/07-change-management.md`
- `workflows/08-documentation-tooling.md`
- `workflows/09-project-profile-and-standards.md`
- `workflows/10-mobile-readiness.md` khi có mobile
- `workflows/11-store-release-readiness.md` khi chuẩn bị mobile store release
- `workflows/12-capability-pack-lifecycle.md` khi reuse AUTH/User Profile/File Upload/Notification/...

## Prompts mới cho profile-specific review

- `prompts/22-project-profile-selector.md`
- `prompts/23-mobile-readiness-review.md`
- `prompts/24-backend-api-readiness-review.md`
- `prompts/26-capability-pack-design.md`
- `prompts/27-capability-pack-import-review.md`
- `prompts/28-capability-pack-upgrade-review.md`

## AI rule

AI không được chọn standard chỉ theo keyword trong filename. Phải đọc `project-profile.json`, registry và ADR. Nếu thiếu evidence, ghi Open Question thay vì tự giả định stack/architecture.

## Gate cuối mỗi batch

```bash
cd tools
npm run docs:all
npm run docs:serve
```

Review Dashboard, typed Traceability, Graph và Diagram Gallery trước khi approve batch.

## Reuse pack quick flow

```bash
cd tools
npm run pack:validate
npm run pack:import -- ../reusable-modules/auth-standard        # preview
npm run pack:import -- ../reusable-modules/auth-standard -- --apply
npm run docs:all
npm run pack:review -- auth-standard --approve
```

Khi có version pack mới, dùng `pack:diff` và `pack:upgrade`; không copy đè file project.
