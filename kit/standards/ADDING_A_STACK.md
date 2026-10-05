# Adding a New Technology Stack

Starter kit không hard-code chỉ ReactJS/React Native/Flutter/NodeJS/.NET. Để thêm stack mới:

1. Tạo folder `kit/standards/stacks/<surface>/<stack>/`.
2. Tạo các standard nhỏ theo concern thay vì một file khổng lồ: architecture, coding, state/data, security, testing, deployment...
3. Thêm entry vào `kit/registry/technology-stacks.json`:

```json
{
  "nextjs": {
    "projectType": "web",
    "displayName": "Next.js",
    "standardsRoot": "kit/standards/stacks/web/nextjs",
    "requiredStandards": ["architecture.md", "routing-rendering.md", "testing-release.md"]
  }
}
```

4. Chạy `cd tools && npm run profile:check`.
5. Nếu stack cần entity/quality rule mới, mở rộng registry thay vì hard-code vào validator.
6. Nếu rule chỉ đúng với một project, dùng ADR/project docs; không biến rule project-specific thành standard global.

## Design rule

- **Project Type Standard** trả lời: một hệ thống loại này cần an toàn/vận hành thế nào?
- **Stack Standard** trả lời: với công nghệ này implement các yêu cầu đó thế nào?
- **ADR** trả lời: project cụ thể này cố ý chọn khác điều gì và vì sao?
