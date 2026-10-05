# Optional local browser vendor assets

`.project-docs/site/` can render Mermaid via CDN without any setup. For fully offline/static-network-isolated hosting, run:

```bash
cd tools
npm run docs:vendor
```

This downloads `mermaid.min.js` into this folder. The site builder automatically prefers the local file when present.

Do not manually modify vendor files.
