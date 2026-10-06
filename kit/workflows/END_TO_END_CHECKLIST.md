# End-to-End Documentation Checklist

## A. Project Foundation
- [ ] Project Overview
- [ ] Product Scope
- [ ] Stakeholders / Personas
- [ ] Glossary
- [ ] Assumptions / Constraints
- [ ] Open Questions

## B. Functional Inventory
- [ ] Module inventory
- [ ] Feature inventory
- [ ] Roles/Permissions
- [ ] User journeys

## C. Feature Detail
- [ ] Nếu có `mockups/`: Screen/state inventory đã được phân tích và map trước khi chốt Screen docs
- [ ] Feature docs
- [ ] Requirements
- [ ] Business Rules
- [ ] Screens / Routes
- [ ] Flows
- [ ] Edge cases

## D. Technical Contracts
- [ ] API docs
- [ ] Database docs
- [ ] Integrations
- [ ] Architecture docs
- [ ] Background jobs

## E. Quality
- [ ] NFR
- [ ] Acceptance Criteria
- [ ] Test Cases
- [ ] Traceability audit

## F. Production
- [ ] Security
- [ ] Environments
- [ ] CI/CD
- [ ] Deployment
- [ ] Rollback
- [ ] Backup/Restore
- [ ] Logging/Monitoring/Alerts
- [ ] Incident Response
- [ ] Runbooks
- [ ] Performance/Capacity

## G. Governance
- [ ] ADR / Decision Log
- [ ] Release Process
- [ ] Changelog
- [ ] Documentation freshness process
- [ ] PROJECT_BLUEPRINT complete

## Final audit questions
- [ ] Có Feature nào không có Requirement?
- [ ] Có Requirement approved nào không có Test Case?
- [ ] Có Screen/API nào không thuộc Feature nào?
- [ ] Có DB object quan trọng nào không biết ai read/write?
- [ ] Có route/API/table production nào không có trong Blueprint?
- [ ] Có blocking Open Question chưa giải quyết?
- [ ] Có tài liệu duplicate source of truth?

## H. Tooling & Visual Review
- [ ] Nếu `mockups/` có asset: `npm run mockup:check` pass
- [ ] Nếu đang mở Screen-first review session: `npm run wireframe:check` pass và accepted gaps đã được reconcile vào canonical docs
- [ ] Mockup Traceability report reviewed
- [ ] `cd tools && npm run docs:validate` pass
- [ ] `npm run docs:sync` pass
- [ ] `npm run docs:build` pass
- [ ] `npm run docs:check-site` pass
- [ ] Dashboard reviewed
- [ ] Catalog reviewed
- [ ] Traceability Matrix reviewed
- [ ] Interactive Graph reviewed for orphan/unexpected links
- [ ] Diagram Gallery reviewed
- [ ] Mermaid flows render correctly
- [ ] Generated output is not being used as canonical business source

## V4 Reuse Gate
- [ ] Project profile resolves correct project-type and stack standards.
- [ ] Reuse detection was performed before detailed module/feature decomposition.
- [ ] Existing Capability/Pattern Packs were considered where relevant.
- [ ] New pack creation is supported by reuse evidence, not convenience alone.
- [ ] Pack import/upgrade preview was reviewed before apply.
- [ ] Pack review status is approved before implementation when the gate is enabled.
- [ ] Project-local docs are canonical after import.

## V5.0 Request / Implementation Governance
- [ ] Durable incoming changes were captured as Requests when provenance matters.
- [ ] Accepted Requests were promoted to existing canonical entities.
- [ ] Canonical docs were updated before Task generation.
- [ ] `npm run gate:ready -- --feature <CODE>` passes before WorkPlan submit.
- [ ] WorkPlan task breakdown, assumptions, risks and acceptance criteria were reviewed.
- [ ] WorkPlan authoring was explicitly completed before submit.
- [ ] WorkPlan approval was performed against a non-stale context hash.
- [ ] Tasks were materialized only from an approved non-stale WorkPlan.
- [ ] Every implementation Task links to at least one Feature.
- [ ] Tasks do not redefine product/business truth.
- [ ] After implementation, linked tests are passed and canonical docs are reconciled.
- [ ] `npm run gate:done -- --feature <CODE>` passes before considering the feature documentation-complete.

## v5.2 Progressive Specification checkpoint

- [ ] Project default spec level and target maturity are explicit.
- [ ] Each Feature that differs from the project default has `spec_level` / `target_maturity` override.
- [ ] Lightweight Features contain minimum Goal / Actors / Main Flow / Key Rules / Acceptance sections.
- [ ] `spec:recommend` warnings are reviewed for sensitive/high-risk work.
- [ ] Ready gate is evaluated against the effective spec profile.
- [ ] Before maturity increases, `spec:promote` gap report is reviewed and resolved.
- [ ] Promotion preserves Feature identity and does not invent requirements.


## Source workspace

- [ ] Application boundaries documented
- [ ] New apps bootstrapped from an approved Source Profile/Base or existing source adopted
- [ ] `.project-docs/source.lock.json` reviewed
- [ ] `source:check` passes
- [ ] Features map to the correct Applications
- [ ] WorkPlan applicationScope matches intended implementation boundaries
