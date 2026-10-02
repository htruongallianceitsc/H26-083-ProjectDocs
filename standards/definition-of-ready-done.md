# Definition of Ready / Done cho tài liệu

## Documentation Ready — trước implementation

Một Feature được coi là Ready khi:

- Feature scope và actors rõ.
- Preconditions, main flow, alternative/error flow đã có.
- Requirement được approved.
- Business Rule liên quan được xác định.
- Screen/Flow đủ nếu có UI.
- API contract đủ nếu có backend.
- DB impact đủ nếu có persistence.
- Permission/security implications đã xác định.
- NFR áp dụng được xác định.
- Acceptance Criteria + Test Case tồn tại.
- Không còn blocking Open Question.
- Traceability đầy đủ.

## Documentation Done — sau implementation/release

- Tài liệu phản ánh hành vi thực tế đã release.
- Route/API/DB inventory cập nhật.
- Test coverage cập nhật.
- Monitoring/runbook cập nhật nếu có thay đổi vận hành.
- ADR mới được ghi nếu có decision đáng kể.
- Release note/changelog có impact chính.
- Không còn stale document từ thay đổi vừa thực hiện.
