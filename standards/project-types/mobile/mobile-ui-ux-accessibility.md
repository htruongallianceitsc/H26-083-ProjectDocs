# Mobile UI/UX & Accessibility Standard

## Mục tiêu
Áp dụng cho mọi project thuộc profile này. Đây là policy/checklist production; tài liệu feature chi tiết chỉ reference standard, không copy toàn bộ rule.

## Rule bắt buộc
- Mỗi screen có Initial/Loading/Refreshing/Success/Empty/Partial/Error/Offline/Permission/Session states khi áp dụng.
- Safe area, keyboard, orientation, dynamic text, screen reader và touch target phải được test.
- List có preserve scroll/key/pagination/duplicate handling.
- Offline/stale/pending state phải hiển thị rõ nếu ảnh hưởng quyết định người dùng.

## Evidence mong đợi
- Blueprint/architecture hoặc entity docs reference standard này.
- Test/release checklist cover các rule áp dụng.
- Exception phải có ADR.
