# Next.js Architecture Standard

Use App Router by default. Keep routing/layout under `src/app`, reusable business UI under `src/features`, shared UI under `src/components`, server-only utilities under `src/server`, and framework-neutral helpers under `src/lib`. Keep Server/Client Component boundaries explicit.
