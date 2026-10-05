# Mobile Time & Timezone Standard

## Mục tiêu
Áp dụng cho mọi project thuộc profile này. Đây là policy/checklist production; tài liệu feature chi tiết chỉ reference standard, không copy toàn bộ rule.

## Rule bắt buộc
- Server time là nguồn chuẩn cho nghiệp vụ nhạy thời gian trừ khi ADR khác.
- Lưu timestamp UTC/offset-aware; UI format theo locale/timezone rule.
- Xử lý device clock sai, timezone change, DST và travel.
- Attendance/timesheet/deadline phải ghi rõ rule rounding/cutoff/server verification.

## Evidence mong đợi
- Blueprint/architecture hoặc entity docs reference standard này.
- Test/release checklist cover các rule áp dụng.
- Exception phải có ADR.
