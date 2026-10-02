# Documentation Standard

## Viết cho người chưa biết project
Mỗi tài liệu phải có đủ context để người mới hiểu được mục đích và phạm vi mà không cần hỏi tác giả.

## Tách Fact / Decision / Assumption / Open Question
Không trình bày assumption như fact. Nếu chưa có quyết định, ghi rõ `TBD` và đưa vào Open Questions.

## Ưu tiên contract có thể kiểm thử
Các mô tả nên đủ cụ thể để chuyển thành acceptance criteria hoặc test case.

## Tránh duplicate
Nếu API request/response đã canonical ở API doc, Feature doc chỉ reference `API-...`.

## Versioning
Dùng Git history cho thay đổi nội dung; metadata `updated_at` và changelog dùng cho review ở cấp project.
