# Standards Architecture

Starter kit dùng hai tầng standard độc lập nhưng ghép được với nhau.

1. **Project Type Standards** — rule chung theo loại hệ thống: `web`, `mobile`, `api`.
2. **Technology Stack Standards** — rule cụ thể theo công nghệ: ReactJS, React Native, Flutter, NodeJS API, ASP.NET Core API, PostgreSQL.

Project thật khai báo `project-profile.json`. AI/PM/Dev phải đọc toàn bộ standard của project type trước, sau đó mới đọc standard của stack. Standard stack **không được ghi đè yêu cầu production/security của project type nếu không có ADR**.

Ví dụ:

```json
{
  "projectTypes": ["mobile", "api"],
  "technologyStacks": ["react-native", "dotnet-core-api", "postgresql"]
}
```

Thứ tự áp dụng:

`Core governance -> Mobile standards -> React Native standards -> API standards -> ASP.NET Core standards -> PostgreSQL standards -> project ADR`.

ADR có thể thay đổi một standard nhưng phải ghi rõ phạm vi, lý do và hậu quả.
