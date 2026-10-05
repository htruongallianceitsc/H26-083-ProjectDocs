Mục tiêu là **một project chỉ quản lý tài liệu**, nhưng tài liệu đó phải đủ tốt để sau 1–3 năm team vẫn có thể bảo trì, onboard người mới, phát triển feature mới, review impact và đưa production an toàn, tôi khuyên không tổ chức đơn thuần theo kiểu “BRD / API docs / DB docs”. Nên xây nó như một **Project Knowledge Base có cấu trúc và traceability**.

Điểm quan trọng nhất là: **mỗi thông tin chỉ có một source of truth**, còn các tài liệu tổng hợp chỉ link tới nó.

## 1. Cấu trúc tổng thể tôi đề xuất

```text
project-docs/
│
├── README.md
├── START_HERE.md
├── PROJECT_BLUEPRINT.md
│
├── 00-project/
│   ├── project-overview.md
│   ├── product-scope.md
│   ├── stakeholders.md
│   ├── glossary.md
│   ├── assumptions.md
│   └── constraints.md
│
├── 01-product/
│   ├── vision.md
│   ├── personas.md
│   ├── user-journeys.md
│   ├── roles-permissions.md
│   └── functional-overview.md
│
├── 02-modules/
│   ├── AUTH/
│   │   ├── module.md
│   │   ├── LOGIN/
│   │   │   └── feature.md
│   │   ├── REGISTER/
│   │   │   └── feature.md
│   │   └── FORGOT_PASSWORD/
│   │       └── feature.md
│   │
│   ├── USER/
│   ├── ORDER/
│   └── PAYMENT/
│
├── 03-requirements/
│   ├── functional/
│   ├── non-functional/
│   └── acceptance-criteria/
│
├── 04-business-rules/
│   ├── BR-AUTH-001.md
│   ├── BR-ORDER-001.md
│   └── ...
│
├── 05-screens/
│   ├── SCR-LOGIN.md
│   ├── SCR-DASHBOARD.md
│   ├── SCR-ORDER-LIST.md
│   └── ...
│
├── 06-flows/
│   ├── business/
│   ├── user/
│   ├── system/
│   └── sequence/
│
├── 07-api/
│   ├── API-AUTH-LOGIN.md
│   ├── API-ORDER-LIST.md
│   ├── API-ORDER-CREATE.md
│   ├── conventions.md
│   ├── authentication.md
│   ├── error-handling.md
│   └── pagination-filtering.md
│
├── 08-database/
│   ├── database-overview.md
│   ├── ERD.md
│   ├── tables/
│   │   ├── User.md
│   │   ├── Order.md
│   │   └── OrderDetail.md
│   ├── views/
│   ├── functions/
│   └── data-rules/
│
├── 09-architecture/
│   ├── system-context.md
│   ├── container-architecture.md
│   ├── frontend-architecture.md
│   ├── backend-architecture.md
│   ├── integration-architecture.md
│   ├── caching.md
│   ├── background-jobs.md
│   ├── realtime.md
│   └── file-storage.md
│
├── 10-security/
│   ├── audit-log.md
│   ├── privacy.md
│   └── security-checklist.md
│
├── 11-quality/
│   ├── testing-strategy.md
│   ├── test-cases/
│   ├── regression.md
│   ├── performance.md
│   ├── accessibility.md
│   └── browser-device-support.md
│
├── 12-devops/
│   ├── environments.md
│   ├── deployment.md
│   ├── ci-cd.md
│   ├── configuration.md
│   ├── infrastructure.md
│   ├── rollback.md
│   └── backup-restore.md
│
├── 13-operations/
│   ├── monitoring.md
│   ├── logging.md
│   ├── alerting.md
│   ├── troubleshooting.md
│   ├── runbooks/
│   ├── scheduled-jobs.md
│   └── disaster-recovery.md
│
├── 14-performance/
│   ├── performance-requirements.md
│   ├── database-performance.md
│   ├── api-performance.md
│   ├── frontend-performance.md
│   └── capacity-planning.md
│
├── 15-decisions/
│   ├── ADR-001.md
│   ├── ADR-002.md
│   └── decision-log.md
│
├── 16-release/
│   ├── release-process.md
│   ├── compatibility.md
│   ├── migration.md
│   └── releases/
│
├── 17-traceability/
│   ├── feature-matrix.md
│   ├── api-matrix.md
│   ├── screen-matrix.md
│   ├── database-matrix.md
│   └── test-coverage.md
│
├── 18-changelog/
│   ├── product-changelog.md
│   └── documentation-changelog.md
│
├── 19-open-items/
│   ├── open-questions.md
│   ├── known-issues.md
│   ├── technical-debt.md
│   └── future-improvements.md
│
└── templates/
    ├── module-template.md
    ├── feature-template.md
    ├── screen-template.md
    ├── api-template.md
    ├── business-rule-template.md
    ├── database-table-template.md
    ├── test-case-template.md
    └── decision-template.md
```

Đây là mức tôi thấy phù hợp với một **production web application lâu dài**.

---

# 2. File quan trọng nhất: `PROJECT_BLUEPRINT.md`

Nếu chỉ có một file mà AI/dev/BA/PM phải đọc đầu tiên thì chính là file này.

Nó không chứa toàn bộ chi tiết. Nó là **bản đồ của toàn project**.

Ví dụ:

```md
# Project Blueprint

## Project
Name: ABC Platform
Version: 2.4
Status: Production

## Technology
Frontend: React
Backend: ASP.NET Core 9
Database: PostgreSQL
Cache: Redis
Hosting: Azure
CI/CD: GitHub Actions

## Modules

| Code | Module | Description |
|---|---|---|
| AUTH | Authentication | Login, register, password |
| USER | User Management | Manage users |
| ORD | Orders | Order lifecycle |
| PAY | Payment | Payment processing |

## Features

| Feature | Module | Screens | APIs |
|---|---|---|---|
| AUTH-LOGIN | AUTH | SCR-LOGIN | API-AUTH-LOGIN |
| ORD-CREATE | ORD | SCR-ORDER-CREATE | API-ORDER-CREATE |

## Screens

| Code | Route | Feature |
|---|---|---|
| SCR-LOGIN | /login | AUTH-LOGIN |
| SCR-ORDER-LIST | /orders | ORD-LIST |

## APIs

| Code | Method | Path |
|---|---|---|
| API-AUTH-LOGIN | POST | /api/auth/login |
| API-ORDER-LIST | GET | /api/orders |

## Database

| Table | Module |
|---|---|
| User | AUTH |
| Order | ORD |
| OrderDetail | ORD |

## External integrations

- Stripe
- Firebase
- SendGrid

## Background Jobs

- OrderExpirationJob
- EmailQueueWorker

## Scheduled Jobs

- DailyReportJob
- CleanupAuditLogJob

## Architecture Docs

- Frontend Architecture
- Backend Architecture
- Database Architecture
- Deployment Architecture
```

Một rule rất đáng áp dụng:

> **Bất kỳ Feature / Screen / Route / API / DB table / Integration quan trọng nào tồn tại trong project đều phải xuất hiện trong Blueprint.**

Và ngược lại:

> **Bất kỳ thứ gì xuất hiện trong Blueprint đều phải có tài liệu chi tiết tương ứng.**

Đây là cách rất hiệu quả để tránh documentation drift.

---

# 3. Nên lấy `Module → Feature` làm xương sống

Không nên lấy Screen hoặc API làm xương sống.

Ví dụ:

```text
ORDER
│
├── Create Order
├── View Order
├── Update Order
├── Cancel Order
├── Payment
├── Refund
└── Order History
```

Trong đó:

```text
Module
   ↓
Feature
   ↓
Requirement
   ↓
Business Rule
   ↓
Screen
   ↓
API
   ↓
Database
   ↓
Test Case
```

Ví dụ thực tế:

```text
ORDER
  ↓
ORD-CANCEL
  ↓
REQ-ORD-023
  ↓
BR-ORD-015
  ↓
SCR-ORDER-DETAIL
  ↓
API-ORDER-CANCEL
  ↓
Order
OrderHistory
  ↓
TC-ORD-CANCEL-001
TC-ORD-CANCEL-002
TC-ORD-CANCEL-003
```

Đây chính là **traceability chain**.

Nếu có bug hoặc thay đổi business rule, ta có thể lần ngược/lần xuôi được toàn bộ impact.

---

# 4. Một `Feature` nên chứa những gì?

Ví dụ:

```text
02-modules/
└── ORDER/
    └── CANCEL_ORDER/
        └── feature.md
```

`feature.md` nên có:

```md
# ORD-CANCEL — Cancel Order

## 1. Overview

## 2. Business Goal

## 3. Actors

## 4. Preconditions

## 5. Trigger

## 6. Main Flow

## 7. Alternative Flows

## 8. Exception Flows

## 9. Business Rules

BR-ORD-001
BR-ORD-015

## 10. Screens

SCR-ORDER-DETAIL
SCR-CANCEL-CONFIRM

## 11. APIs

API-ORDER-CANCEL

## 12. Database

Order
OrderHistory

## 13. Permissions

ORDER_CANCEL

## 14. Notifications

OrderCancelledNotification

## 15. Audit

Record:
- UserId
- OrderId
- Reason
- Timestamp

## 16. Acceptance Criteria

AC01...
AC02...

## 17. Test Cases

TC-ORD-CANCEL-001
TC-ORD-CANCEL-002

## 18. Edge Cases

...

## 19. Dependencies

...

## 20. Known Limitations

...

## 21. Open Questions

...
```

Feature là nơi tập trung **context**, nhưng không copy nguyên API spec hay DB spec vào đây.

Nó chỉ reference:

```text
API-ORDER-CANCEL
Order
OrderHistory
BR-ORD-015
```

---

# 5. Screen cần được coi là một entity riêng

Đối với web app lớn, Screen documentation rất quan trọng.

Ví dụ:

```text
SCR-ORDER-LIST
```

Tài liệu:

```md
# Order List

Code: SCR-ORDER-LIST
Route: /orders

## Purpose

## Accessible Roles

- Admin
- Sales
- Manager

## Entry Points

- Sidebar → Orders
- Dashboard → Recent Orders

## Components

- Search
- Status filter
- Date filter
- Order table
- Pagination

## Data Sources

API-ORDER-LIST
API-ORDER-STATUS

## Actions

View
Edit
Cancel
Export

## States

Loading
Success
Empty
Error
No Permission

## Validation

...

## Responsive Behavior

...

## Permissions

...

## Related Features

ORD-LIST
ORD-CANCEL
ORD-UPDATE
```

Một lợi ích rất lớn là bạn có thể hỏi:

> Route `/orders/:id` liên quan tới feature nào, gọi API nào và dùng table nào?

Documentation có thể trả lời chính xác.

---

# 6. API cũng phải có identity riêng

Ví dụ:

```text
API-ORD-001
POST /api/orders/{id}/cancel
```

Không chỉ document request/response.

Nên có:

```text
Purpose
Authentication
Authorization
Request
Response
Validation
Business rules
Database read/write
Transaction
Concurrency
Idempotency
Caching
Rate limit
Error codes
Audit
Logging
External dependencies
Performance expectation
Related feature
Related screens
Related tests
```

Ví dụ rất quan trọng:

```text
Database impact

READ:
- Order
- User

WRITE:
- Order
- OrderHistory

Transaction:
Order + OrderHistory must commit atomically
```

Sau này debugging production cực kỳ hữu ích.

---

# 7. Database docs không chỉ là schema

Mỗi table nên có:

```text
Purpose

Primary key

Columns

Foreign keys

Indexes

Unique constraints

Check constraints

Data ownership

Who writes it

Who reads it

Lifecycle

Soft delete strategy

Retention

Audit

Sensitive fields

Expected volume

Growth rate

Performance considerations
```

Ví dụ:

```text
Order

Owner module:
ORDER

Written by:
API-ORDER-CREATE
API-ORDER-UPDATE
API-ORDER-CANCEL

Read by:
API-ORDER-LIST
API-ORDER-DETAIL

Related tables:
OrderDetail
OrderHistory
Payment
```

Đây là documentation giúp review DB production cực mạnh.

---

# 8. Business Rule nên tách khỏi Feature

Đây là phần nhiều project làm thiếu.

Không nên chỉ viết:

> User cannot cancel a completed order.

trong một đoạn text của feature.

Nên có:

```text
BR-ORD-015
```

```md
# BR-ORD-015

## Rule

Completed orders cannot be cancelled.

## Applies To

ORD-CANCEL

## Conditions

Order.Status = Completed

## Expected Behaviour

Cancel action disabled.

API must reject cancellation.

## Error

ORDER_ALREADY_COMPLETED

## Implemented By

API-ORDER-CANCEL

## Tested By

TC-ORD-CANCEL-004
```

Khi business thay đổi, AI hoặc developer có thể tìm chính xác impact.

---

# 9. Cross-cutting architecture cực kỳ quan trọng

Đây là phần giúp project sống lâu.

Không liên quan trực tiếp đến một feature nhưng ảnh hưởng toàn hệ thống:

```text
Authentication

Authorization

Error handling

API convention

Logging

Audit

Caching

File storage

Background job

Queue

Realtime

Email

Notification

Search

Pagination

Rate limiting

Retry policy

Timeout

Circuit breaker

Database transaction

Concurrency

Idempotency
```

Ví dụ:

```text
09-architecture/
    authentication.md
    authorization.md
    caching.md
    background-job.md
    realtime.md
```

Dev mới đọc những file này sẽ hiểu được **"project này làm mọi thứ theo rule gì"**.

---

# 10. Production documentation cần thêm một layer mà dự án thường bỏ quên

Nếu thực sự muốn chạy production dài hạn, documentation không thể dừng ở:

```text
Feature
Screen
API
DB
```

Mà cần có:

```text
Development
      ↓
Deployment
      ↓
Production
      ↓
Monitoring
      ↓
Incident
      ↓
Recovery
```

Nên document tối thiểu:

### Environment

```text
Local
DEV
SIT
UAT
Staging
Production
```

Mỗi môi trường:

```text
purpose
URL
database
storage
third-party integrations
configuration strategy
deployment source
```

Không ghi secret trực tiếp.

---

# 11. Monitoring và observability

Production project nên document:

```text
Application logs
API logs
Database logs
Audit logs

TraceId
RequestId
SessionId

Metrics

CPU
Memory
API latency
Error rate
DB connections
slow queries

Alerts
```

Ví dụ:

```text
Alert:
API error rate > 5%

Severity:
High

Action:
Check API logs
Check DB connections
Check downstream dependency
```

---

# 12. Runbook

Đây là thứ rất có giá trị sau khi production.

Ví dụ:

```text
runbooks/

RB-001-site-down.md
RB-002-database-high-cpu.md
RB-003-api-timeout.md
RB-004-payment-failure.md
RB-005-storage-full.md
RB-006-rollback-release.md
```

Ví dụ:

```text
Site Down

1. Check health endpoint.
2. Check IIS/container.
3. Check database connectivity.
4. Check Redis.
5. Check recent deployment.
6. Check logs.
7. Rollback if necessary.
```

Đó mới là documentation dành cho **production**, không chỉ dành cho development.

---

# 13. Non-functional requirements cũng phải được quản lý

Không nên chỉ có functional requirements.

Ví dụ:

```text
NFR-PERF-001
API P95 response time < 1 second

NFR-SEC-001
Access tokens expire after X minutes.

NFR-AVAIL-001
Target availability 99.9%.

NFR-DATA-001
Production DB backup every X hours.

NFR-BROWSER-001
Support latest two versions of Chrome/Edge/Safari.
```

Nhóm nên có:

```text
Performance
Scalability
Security
Availability
Reliability
Accessibility
Compatibility
Maintainability
Observability
Backup
Recovery
Privacy
Data retention
```

---

# 14. Decision Log / ADR rất quan trọng

Sau vài năm thường gặp câu hỏi:

> Tại sao ngày xưa lại thiết kế như thế này?

Nếu không có ADR, không ai biết.

Ví dụ:

```text
ADR-001-use-postgresql.md
ADR-002-use-redis-cache.md
ADR-003-soft-delete.md
ADR-004-jwt-authentication.md
```

Nội dung:

```text
Decision

Context

Options Considered

Chosen Option

Reason

Consequences

Date

Status:
Accepted / Deprecated / Superseded
```

Đặc biệt:

**Không sửa lịch sử decision cũ.**

Nếu thay đổi:

```text
ADR-003
    ↓ superseded by
ADR-027
```

---

# 15. Tôi sẽ phân loại thông tin project thành 8 nhóm lớn

Nếu nhìn ở mức conceptual thì toàn bộ documentation chỉ cần hiểu theo mô hình này:

| Nhóm           | Trả lời câu hỏi                                   |
| -------------- | ------------------------------------------------- |
| **Product**    | Hệ thống dùng để làm gì?                          |
| **Business**   | Hệ thống phải tuân theo rule gì?                  |
| **Functional** | Hệ thống có những chức năng nào?                  |
| **UX/UI**      | Người dùng tương tác thế nào?                     |
| **Technical**  | Hệ thống được xây dựng thế nào?                   |
| **Quality**    | Làm sao biết hệ thống hoạt động đúng?             |
| **Operations** | Làm sao vận hành production?                      |
| **Governance** | Vì sao có các quyết định này và thay đổi thế nào? |

Sau đó mới chia nhỏ ra:

```text
Product
 ├ Module
 ├ Feature
 └ User Journey

Business
 ├ Requirement
 └ Business Rule

UX
 ├ Screen
 ├ Route
 └ Flow

Technical
 ├ API
 ├ Database
 ├ Architecture
 └ Integration

Quality
 ├ Acceptance Criteria
 ├ Test Case
 └ NFR

Operations
 ├ Deployment
 ├ Monitoring
 ├ Alert
 ├ Runbook
 └ Backup

Governance
 ├ Decision
 ├ Change
 └ Release
```

---

# 16. Quan trọng hơn folder: phải có quan hệ giữa các tài liệu

Tôi sẽ đặt requirement rằng các entity phải link được với nhau.

Ví dụ:

```text
Module
   │
   └── Feature
         │
         ├── Requirement
         │      └── Business Rule
         │
         ├── Screen
         │
         ├── API
         │
         ├── Database
         │
         ├── External Integration
         │
         └── Test Case
```

Một Feature tốt phải có khả năng trả lời:

```text
Feature này nằm module nào?

Business requirement nào tạo ra nó?

Business rules nào chi phối?

User sử dụng màn hình nào?

Route nào?

API nào được gọi?

API đọc/write bảng nào?

Permission nào cần?

Có background job nào liên quan?

Có external service nào?

Test case nào cover?

Production monitoring bằng gì?
```

Nếu documentation trả lời được các câu đó thì project đã ở mức rất tốt.

---

# 17. Nên có một Traceability Matrix tự động

Ví dụ:

| Feature      | Requirement | Rule   | Screen       | API          | DB    | Test   |
| ------------ | ----------- | ------ | ------------ | ------------ | ----- | ------ |
| Login        | REQ-001     | BR-001 | Login        | POST /login  | User  | TC-001 |
| Create Order | REQ-010     | BR-020 | Order Create | POST /orders | Order | TC-020 |
| Cancel Order | REQ-015     | BR-025 | Order Detail | POST /cancel | Order | TC-030 |

Từ bảng này rất dễ phát hiện:

```text
Feature không có test

API không thuộc feature nào

Screen không có requirement

Business rule chưa có testcase

DB table không rõ feature nào sử dụng
```

Đây chính là quality gate cho documentation.

---

# 18. Một số metadata tôi khuyên mọi tài liệu entity đều có

Ví dụ đầu file:

```yaml
---
code: FEAT-ORD-CANCEL
type: feature
title: Cancel Order

status: approved

owner: Order Team

created_at: 2026-01-10
updated_at: 2026-09-20

module: ORDER

related:
  requirements:
    - REQ-ORD-015

  business_rules:
    - BR-ORD-021

  screens:
    - SCR-ORDER-DETAIL

  apis:
    - API-ORDER-CANCEL

  database:
    - Order
    - OrderHistory

  tests:
    - TC-ORD-CANCEL-001
---
```

Như vậy AI hoặc một script có thể parse toàn bộ documentation thành graph.

---

# 19. Không nên để cấu trúc phụ thuộc quá nhiều vào folder

Folder chỉ để **con người dễ nhìn**.

Identity thật nên là:

```text
MOD-ORDER

FEAT-ORDER-CANCEL

REQ-ORDER-023

BR-ORDER-015

SCR-ORDER-DETAIL

API-ORDER-CANCEL

DB-ORDER

TC-ORDER-CANCEL-001

ADR-012
```

Bởi vì file có thể di chuyển folder nhưng code/reference không nên thay đổi.

---

# 20. Tôi đặc biệt khuyên có 4 lớp tài liệu

Đây là mô hình tôi thấy phù hợp nhất với mục tiêu của bạn:

```text
                 PROJECT_BLUEPRINT
                        │
                        ▼
                MODULE / FEATURE
                        │
            ┌───────────┼────────────┐
            ▼           ▼            ▼
        Business       UI         Technical
            │           │            │
        Rule/Req     Screen       API / DB
            │           │            │
            └───────────┼────────────┘
                        ▼
                     Testing
                        │
                        ▼
                    Production
```

### Level 1 — Project Map

```text
PROJECT_BLUEPRINT
```

Cho người/AI đọc trong vài phút để hiểu toàn hệ thống.

### Level 2 — Functional Knowledge

```text
Module
Feature
Requirement
Business Rule
Flow
```

Cho BA/PM/Dev hiểu sản phẩm.

### Level 3 — Implementation Contract

```text
Screen
API
Database
Integration
Architecture
```

Cho dev triển khai.

### Level 4 — Production Knowledge

```text
Tests
Deployment
Monitoring
Runbook
Security
Performance
Backup
Recovery
Decision
```

Cho hệ thống tồn tại lâu dài.

---

# 21. Một nguyên tắc rất quan trọng: đừng copy thông tin

Ví dụ **sai**:

`feature.md`:

```text
POST /api/order
request {...}
response {...}
```

`api.md`:

```text
POST /api/order
request {...}
response {...}
```

Sau này API đổi và một trong hai file không update.

Nên:

`feature.md`:

```text
API:
- API-ORDER-CREATE
```

`API-ORDER-CREATE.md` mới là **source of truth**.

Tương tự cho:

```text
Business Rule
Screen
API
Database
NFR
```

---

# 22. Nếu dùng AI Agent thì cấu trúc này càng có giá trị

Có thể đặt rule cho AI:

> Trước khi đề xuất thay đổi Feature, phải đọc Feature và các Requirement, Business Rule, Screen, API, Database, Test liên quan.

Sau khi thay đổi:

> AI phải chạy impact analysis và liệt kê những tài liệu có thể cần cập nhật.

Ví dụ thay:

```text
BR-ORDER-015
```

AI có thể phát hiện:

```text
Affected:

FEAT-ORDER-CANCEL
SCR-ORDER-DETAIL
API-ORDER-CANCEL
TC-ORDER-CANCEL-002
TC-ORDER-CANCEL-004
```

Đó là bước từ **documentation repository** sang **project knowledge graph**.

---

# 23. Nếu muốn gọn hơn, tôi sẽ chọn 12 loại entity cốt lõi

Không nhất thiết ngay từ đầu phải có 50 loại document.

Tôi khuyên core chỉ cần:

```text
Project
Module
Feature
Requirement
Business Rule
Screen
Flow
API
Database Object
Test Case
Decision
Document
```

Sau đó thêm:

```text
Integration
NFR
Runbook
Release
Bug
Task
```

khi cần.

---

# 24. Cấu trúc tôi chọn nếu đây là project của tôi

Tôi sẽ lấy:

```text
PROJECT_BLUEPRINT.md

docs/
├── project/
├── modules/
├── features/
├── requirements/
├── business-rules/
├── screens/
├── flows/
├── api/
├── database/
├── architecture/
├── security/
├── testing/
├── operations/
├── decisions/
└── traceability/
```

và đặt **5 rule bắt buộc**:

1. `PROJECT_BLUEPRINT.md` phải liệt kê toàn bộ Module, Feature, Screen, Route, API và các DB object chính.
2. Mỗi item trong Blueprint phải có tài liệu chi tiết tương ứng.
3. Mọi Feature phải trace được tới `Requirement → Rule → Screen/API/DB → Test`.
4. Thông tin chỉ có **một source of truth**, tài liệu khác chỉ reference.
5. Khi một entity thay đổi phải thực hiện **impact analysis + documentation freshness check**.

Nếu 5 rule này được giữ nghiêm thì dù project phát triển trong nhiều năm, tài liệu vẫn khó rơi vào trạng thái **“có rất nhiều document nhưng không ai tin document nào còn đúng”**.

### Mức trưởng thành mà tôi sẽ hướng tới

```text
Idea
 ↓
Project
 ↓
Module
 ↓
Feature
 ↓
Requirement ── Business Rule
 ↓
Screen / Flow
 ↓
API
 ↓
Database / Integration
 ↓
Test
 ↓
Deployment
 ↓
Monitoring / Runbook

        ↕
 Decision / Change history
```

Đây cũng là cấu trúc rất thuận lợi nếu về sau bạn muốn cho **AI Agent đọc toàn bộ project, tự tạo tài liệu feature mới, kiểm tra thiếu tài liệu, phân tích impact và sau cùng mới sinh task/code**.

---

# V5.0 implementation-governance extension

The canonical documentation tree now continues with:

```text
docs/
├── 21-requests/     # durable intake/provenance
├── 22-tasks/        # implementation execution units
└── 23-bugs/         # durable defect records

.project-docs/
└── workplans/       # reviewed plans + context hashes; not domain truth

registry/
├── readiness-rules.json
└── workplan.schema.json
```

The intended execution path is:

```text
Request
 -> Canonical docs
 -> Ready Gate
 -> WorkPlan
 -> Approval
 -> Task
 -> Implementation
 -> Documentation reconciliation
 -> Done Gate
```

This extends the earlier Module -> Feature -> Requirement -> Screen/API/DB/Test graph; it does not replace it. Feature remains the functional backbone, while Request/WorkPlan/Task provide provenance and controlled execution.

---

# v5.2 Governance Additions

The long-term project structure now also reserves these implementation-governance paths:

```text
project-root/
├── docs/
│   ├── 21-requests/
│   ├── 22-tasks/
│   ├── 23-bugs/
│   └── _generated/
├── registry/
│   ├── readiness-rules.json
│   ├── freshness-rules.json
│   └── impact-rules.json
└── .project-docs/
    ├── workplans/
    ├── freshness/
    ├── changesets/
    ├── baselines/
    └── audit-state.json
```

`docs/` remains project/domain truth. `.project-docs/` holds review, planning and history state used to govern that truth.

---

# v5.2 — Progressive Specification / Lightweight Mode

Không phải mọi project hoặc Feature đều cần decomposition production-level ngay từ đầu. v5.2 thêm `spec_level` như một dimension độc lập với lifecycle:

```text
lightweight -> standard -> full
      ^           ^          ^
 prototype     normal       high-risk /
 / mock         product      production-critical
```

- Lightweight vẫn dùng Feature canonical bình thường.
- Không tạo duplicate entity tree riêng cho mock.
- `registry/spec-profiles.json` định nghĩa minimum documentation theo level.
- `target_maturity` cho biết concept/prototype/UAT/production.
- Ready/Done gate resolve theo effective level.
- `spec:promote` sinh gap report trước khi nâng level.
- Risk rules có thể recommend Standard/Full nếu payment/privacy/security/migration/integration làm Lightweight trở nên không phù hợp.

Mục tiêu là **progressive normalization**: tài liệu ngắn nhưng đủ dùng ở giai đoạn đầu, sau đó extract thành Requirement/Test/API/Screen/NFR khi maturity thực sự cần, không viết lại Feature từ đầu.

---

# v5.3 — Root Entry & Version History Hygiene

Repository root được giữ như **minimal entry surface** thay vì general archive.

```text
project-root/
├── README.md
├── START_HERE.md
├── PROJECT_BLUEPRINT.md
├── project.profile.json
├── starter-kit.json
└── docs/
    ├── guides/
    │   ├── docs-governance.md
    │   ├── file-catalog.md
    │   └── project-structure.md
    └── history/
        ├── README.md
        ├── V3_...
        ├── V4_...
        ├── V5_...
        └── future version upgrade / QA records
```

Rules:

- version upgrade notes, QA reports và historical transition reviews nằm trong `docs/history/`;
- general guides và governance docs nằm trong `docs/guides/` hoặc `standards/`;
- `starter-kit.json.documentationLayout` định nghĩa history directory và filename patterns;
- `docs:validate` fail với `ROOT_HISTORY_DOC` nếu historical hoặc non-entry file quay lại root;
- generated catalog/site vẫn index `docs/guides/` và `docs/history/`, giúp giảm noise ở root nhưng duy trì 100% discoverability.


# v5.4 — Source Workspace & Source Base Profiles

The project is now intended to hold documentation/governance and implementation source in one portable workspace.

```text
project/
├── docs/
├── .project-docs/
├── registry/
├── standards/
├── source-bases/
├── apps/
├── packages/
├── tests/
├── infra/
└── tools/
```

`apps/` is the preferred home for deployable applications. `packages/` is for reusable project-local libraries. Existing repositories may adopt source in place. `source-bases/` contains bootstrap templates only and is excluded from normal documentation indexing.

A stack changes the structure **inside** an Application boundary, not the workspace root model.

# v5.5 - Entity Hardening, Source Intelligence and Local Knowledge Runtime

New governance/configuration:

```text
registry/
├── entity-policy.json
├── source-intelligence.json
├── local-engine.json
└── views.json
```

New derived runtime state:

```text
.project-docs/
├── indexes/
│   ├── entity-index.json
│   ├── relation-index.json
│   ├── search-index.json
│   └── source-index.json
└── reports/
    ├── context-pack.json
    └── git-impact.json
```

New tool surfaces:

```text
entity:identity-status / entity:identity-backfill / entity:transition
source:scan / source:map / git:status / git:impact
knowledge:reindex / search / query / context / view:list / view:run / doctor
```

All indexes and reports above are rebuildable. They are not project sources of truth.
