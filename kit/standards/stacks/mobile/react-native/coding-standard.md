# React Native Coding Standard

## Rules
- TypeScript strict mode is mandatory for production variants. Avoid `any` except at isolated integration boundaries with an explanatory comment.
- Keep route files thin. Business logic belongs in features/core.
- Keep platform branches explicit (`.ios.ts`, `.android.ts`) only when a shared abstraction cannot express the behavior.
- Do not access environment variables, storage, notifications, analytics, network or native modules directly from arbitrary components; use core adapters.
- Async effects must define cancellation/staleness behavior. Avoid unowned background promises.
- UI components must have deterministic Loading/Empty/Data/Error/Disabled states when applicable.
- Sensitive values must never be logged.

## Review checklist
- Typecheck passes.
- No route-level business logic.
- No cross-feature internal imports.
- Errors cross a normalized application boundary.
- Native/platform dependencies are isolated.
