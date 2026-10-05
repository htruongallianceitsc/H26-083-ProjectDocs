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
