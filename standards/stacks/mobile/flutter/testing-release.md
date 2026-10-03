# Flutter Testing & Release

## Scope
Technology-specific standard. Áp dụng sau project-type standard tương ứng.

## Rules
- Unit/widget/integration test theo risk.
- Test lifecycle, network switch, permission, deep link, push và offline critical flow.
- Profile/release performance test trên device thật.
- Signing/store/release artifact và crash symbol upload có checklist.

## Review checklist
- Có architecture/ADR nếu project cố ý khác chuẩn.
- Test và CI thể hiện rule quan trọng.
- Không copy secret hoặc environment-specific credential vào tài liệu.
