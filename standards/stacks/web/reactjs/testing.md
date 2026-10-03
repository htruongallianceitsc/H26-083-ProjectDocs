# ReactJS Testing

## Scope
Technology-specific standard. Áp dụng sau project-type standard tương ứng.

## Rules
- Unit cho pure logic, component test cho UI behavior, E2E cho critical flow.
- Không over-mock network contract; contract test/mock server nên dựa fixture có version.
- Accessibility checks cho component critical.
- Test loading/error/empty/permission states.

## Review checklist
- Có architecture/ADR nếu project cố ý khác chuẩn.
- Test và CI thể hiện rule quan trọng.
- Không copy secret hoặc environment-specific credential vào tài liệu.
