# React Native Storage & Networking

## Scope
Technology-specific standard. Áp dụng sau project-type standard tương ứng.

## Rules
- SecureStore/Keychain/Keystore cho secret; AsyncStorage chỉ preferences/non-secret.
- NetInfo chỉ signal connectivity, không chứng minh Internet/backend healthy.
- Axios/fetch client có timeout/cancel/error mapping/correlation id.
- Offline queue cần durable storage và dedupe.

## Review checklist
- Có architecture/ADR nếu project cố ý khác chuẩn.
- Test và CI thể hiện rule quan trọng.
- Không copy secret hoặc environment-specific credential vào tài liệu.
