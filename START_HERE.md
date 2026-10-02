# START HERE — Quy trình từ ý tưởng đến bộ tài liệu production-ready

## Mục tiêu

Tạo một bộ tài liệu đủ chi tiết để:

- PM/BA hiểu phạm vi sản phẩm.
- UX/UI hiểu screen, route, state và flow.
- Dev hiểu contract cần triển khai.
- QA có acceptance criteria và test coverage.
- DevOps/Ops hiểu deployment, monitoring, rollback, recovery.
- Team mới có thể onboard mà không phụ thuộc người cũ.
- AI Agent có thể đọc project, phân tích impact và sinh tài liệu mới có kiểm soát.

## 7 phase

| Phase | Mục tiêu | Output chính |
|---|---|---|
| 1 | Idea & Discovery | Project Overview, Scope, Glossary, Open Questions |
| 2 | Blueprint | Module, Feature inventory, Route/API/DB inventory |
| 3 | Functional Detail | Requirement, Rule, Feature, Screen, Flow |
| 4 | Technical Contracts | API, DB, Integration, Architecture |
| 5 | Quality | Acceptance Criteria, Test Case, NFR |
| 6 | Production Readiness | Security, DevOps, Monitoring, Runbook, Backup |
| 7 | Governance | Traceability, Decisions, Change/Release process |

## Cách làm khuyến nghị

### Phase 1 — Idea & Discovery
Đọc `workflows/01-idea-to-scope.md`, sau đó dùng:
- `prompts/01-idea-to-project-overview.md`
- `prompts/02-discovery-open-questions.md`

### Phase 2 — Blueprint
Đọc `workflows/02-scope-to-blueprint.md`, dùng:
- `prompts/03-build-project-blueprint.md`
- `prompts/04-module-decomposition.md`

### Phase 3 — Functional Detail
Đọc `workflows/03-blueprint-to-functional-docs.md`, dùng:
- `prompts/05-feature-specification.md`
- `prompts/06-requirements-business-rules.md`
- `prompts/07-screen-route-ux.md`
- `prompts/08-flow-diagrams.md`

### Phase 4 — Technical Contracts
Đọc `workflows/04-functional-to-technical-contracts.md`, dùng:
- `prompts/09-api-contracts.md`
- `prompts/10-database-design.md`
- `prompts/11-architecture-integrations.md`

### Phase 5 — Quality
Đọc `workflows/05-quality-and-test.md`, dùng:
- `prompts/12-non-functional-requirements.md`
- `prompts/13-test-design.md`
- `prompts/17-traceability-audit.md`

### Phase 6 — Production Readiness
Đọc `workflows/06-production-readiness.md`, dùng:
- `prompts/14-security-review.md`
- `prompts/15-devops-production.md`
- `prompts/16-monitoring-runbooks.md`

### Phase 7 — Governance & Maintenance
Đọc `workflows/07-change-management.md`, dùng:
- `prompts/18-change-impact-analysis.md`
- `prompts/19-release-readiness.md`
- `prompts/20-documentation-maintenance.md`

## Rule quan trọng khi dùng AI

Không yêu cầu AI "viết hết project một lần". Hãy đi theo phase và review output mỗi phase. AI phải ghi rõ assumptions, open questions và các nơi chưa có đủ evidence. Không được tự biến assumption thành business fact.
