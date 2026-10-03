# PROJECT BLUEPRINT

## 0. Project Profile

- **Project Types:** `<web | mobile | api>`
- **Technology Stacks:** `<reactjs | react-native | flutter | nodejs-api | dotnet-core-api | postgresql | ...>`
- **Profile File:** `project-profile.json`
- **Applicable Standards:** generated/reviewed via `tools -> npm run profile:check`
- **Standard Exceptions:** reference ADR codes only.


> Đây là bản đồ cấp cao và inventory toàn project. Không copy chi tiết từ các tài liệu con; chỉ tóm tắt và reference.

## 1. Project Summary

- **Project Name:** `<PROJECT_NAME>`
- **Project Code:** `<PROJECT_CODE>`
- **Status:** Discovery / Design / UAT / Production
- **Primary Owner:** `<OWNER>`
- **Business Goal:** `<1-3 sentences>`
- **Primary Users:** `<roles/personas>`
- **Last Reviewed:** `<YYYY-MM-DD>`

## 2. Scope

### In Scope
- `<...>`

### Out of Scope
- `<...>`

## 3. Technology Overview

| Layer | Technology | Notes |
|---|---|---|
| Frontend | `<...>` | |
| Backend | `<...>` | |
| Database | `<...>` | |
| Cache | `<...>` | |
| Queue | `<...>` | |
| Storage | `<...>` | |
| Hosting | `<...>` | |
| CI/CD | `<...>` | |

## 4. Modules

| Code | Module | Purpose | Owner | Status | Detail |
|---|---|---|---|---|---|
| `<MOD-AUTH>` | Authentication | `<...>` | `<...>` | Planned | `docs/02-modules/...` |

## 5. Feature Inventory

| Feature Code | Module | Feature | Priority | Status | Detail |
|---|---|---|---|---|---|
| `<FEAT-AUTH-LOGIN>` | `<MOD-AUTH>` | Login | P0 | Planned | `<link>` |

## 6. Screen & Route Inventory

| Screen Code | Platform | Screen | Route | Feature(s) | Roles | Detail |
|---|---|---|---|---|---|---|
| `<SCR-LOGIN>` | Web/Mobile | Login | `/login` | `<FEAT-AUTH-LOGIN>` | Guest | `<link>` |

## 7. API Inventory

| API Code | Method | Path | Feature(s) | Auth | Detail |
|---|---|---|---|---|---|
| `<API-AUTH-LOGIN>` | POST | `/api/auth/login` | `<FEAT-AUTH-LOGIN>` | Public | `<link>` |

## 8. Database Object Inventory

| DB Code | Object | Type | Module | Owner | Detail |
|---|---|---|---|---|---|
| `<DB-USER>` | `User` | Table | AUTH | `<...>` | `<link>` |

## 9. External Integrations

| Code | Integration | Purpose | Features | Criticality | Detail |
|---|---|---|---|---|---|
| `<INT-EMAIL>` | Email Provider | Transactional email | `<...>` | High | `<link>` |

## 9A. Mobile Contract Inventory

> Chỉ dùng khi project có `mobile`.

| Code | Type | Purpose | Feature(s) | Detail |
|---|---|---|---|---|
| `<PERM-CAMERA>` | Permission | Camera access | `<...>` | `<link>` |
| `<DL-ORDER>` | Deep Link | Open order detail | `<...>` | `<link>` |
| `<PUSH-ORDER>` | Push Event | Order changed | `<...>` | `<link>` |
| `<LS-SESSION>` | Local Storage | Session/cache | `<...>` | `<link>` |
| `<SYNC-TASK>` | Sync Policy | Offline task mutation | `<...>` | `<link>` |
| `<DTP-MOBILE>` | Device Test Profile | OS/device/network matrix | `<...>` | `<link>` |

## 10. Background & Scheduled Processing

| Code | Name | Trigger/Schedule | Purpose | Data Impact | Detail |
|---|---|---|---|---|---|
| `<JOB-001>` | `<...>` | `<...>` | `<...>` | `<...>` | `<link>` |

## 11. Security Overview

- Authentication: `<...>`
- Authorization model: `<RBAC/ABAC/...>`
- Sensitive data classes: `<...>`
- Audit requirements: `<...>`
- Main security docs: `docs/10-security/`

## 12. Environments

| Environment | Purpose | URL | Deployment Source | Data Policy |
|---|---|---|---|---|
| DEV | Development | `<...>` | `<branch/tag>` | Synthetic |
| UAT | Acceptance | `<...>` | `<...>` | Sanitized |
| PROD | Production | `<...>` | Release | Real |

## 13. Non-Functional Targets

| Category | Target | Ref |
|---|---|---|
| Availability | `<...>` | `<NFR-...>` |
| API latency | `<...>` | `<NFR-...>` |
| Recovery | `<RPO/RTO>` | `<NFR-...>` |
| Client compatibility | `<Browser / OS / app-version support>` | `<NFR-...>` |

## 14. Release & Operations

- Release process: `docs/16-release/release-process.md`
- Monitoring: `docs/13-operations/monitoring.md`
- Incident response: `docs/13-operations/incident-response.md`
- Backup/restore: `docs/12-devops/backup-restore.md`
- Runbooks: `docs/13-operations/runbooks/`

## 15. Open Questions / Risks

| ID | Type | Question/Risk | Owner | Blocking | Status |
|---|---|---|---|---|---|
| `<OQ-001>` | Question | `<...>` | `<...>` | Yes | Open |

## 16. Documentation Health

- Missing feature docs: `<count/list>`
- Missing API docs: `<count/list>`
- Requirements without tests: `<count/list>`
- Orphan screens/APIs/DB objects: `<count/list>`
- Stale docs needing review: `<count/list>`
