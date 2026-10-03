# Flutter Storage & Networking

## Scope
Technology-specific standard. Áp dụng sau project-type standard tương ứng.

## Rules
- Secure storage cho token/secret; SharedPreferences cho preference; DB cho offline structured data.
- Dio/network layer có timeout/interceptor/cancel/retry policy.
- Cache expiry/migration/logout cleanup bắt buộc.
- Socket lifecycle gắn AppLifecycleState và reconnect policy.

## Review checklist
- Có architecture/ADR nếu project cố ý khác chuẩn.
- Test và CI thể hiện rule quan trọng.
- Không copy secret hoặc environment-specific credential vào tài liệu.
