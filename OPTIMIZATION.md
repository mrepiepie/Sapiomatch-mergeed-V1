# Learnova Optimized Build

This folder is a performance-optimized copy of `Learnova-mergeed-V1-main`, tuned for faster deployment and smaller initial page loads.

## What changed

### Bundle size and loading
- **Route-level code splitting** — Secondary views (`Home`, `Explore`, dashboards, auth, etc.) load on demand via `next/dynamic`.
- **Core match flow bundled** — `Questionnaire` and `Results` are statically imported because they are linked directly via `#questionnaire` / `#results` hash navigation; lazy chunks caused `ChunkLoadError` in dev.
- **Lazy institution data** — The large `mockInstitutions` dataset (~1,800 lines) loads asynchronously after first paint instead of blocking the main chunk.
- **Lazy AI fallback** — `aiEngine.js` loads only when the chat API is unavailable.
- **3D globe deferred** — `LearnovaEarthGlobe` (Three.js) loads only when the home page renders it.
- **Removed dead code** — ~460 lines of unused client-side mock fetch interceptor removed from `page.js`.

### Build configuration
- `optimizePackageImports` for `lucide-react`, Three.js, and React Three Fiber (no duplicate `modularizeImports`, which broke dynamic chunks)
- Production `removeConsole` (keeps errors/warnings)
- Response compression enabled

### Fonts
- Google Fonts replaced with `next/font` (self-hosted, no render-blocking CSS requests)
- Removed duplicate `@import` from `index.css`

### Data structure
- `mockQuestions` moved to `src/data/mockQuestions.js` so the questionnaire config does not pull in the full institutions file

## Run locally

```bash
npm install
npm run dev          # Next.js frontend (port 3000)
npm run server       # Express API backend (port 5000)
```

## Deploy

Same as the original project — build the Next.js app and run the Express server for `/api/chat` and related routes:

```bash
npm run build
npm start
```

## Original vs optimized

| Area | Original | Optimized |
|------|----------|-----------|
| `page.js` | ~2,370 lines, all views imported upfront | ~1,910 lines, dynamic imports |
| Initial JS | All views + full mock data | Shell + active view only |
| Fonts | External Google Fonts | Self-hosted via `next/font` |
| Backup files | `.bak` copies included | Excluded from copy |

Functionality is unchanged; only load strategy and build settings differ.
