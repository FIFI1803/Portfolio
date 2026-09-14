# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (Vite HMR)
npm run build     # Production build
npm run preview   # Preview production build locally
npm run lint      # Run ESLint
npm test          # Vitest unit tests (src/**/*.test.*; e2e/ is excluded)
npm run e2e       # Playwright e2e (builds, then runs against vite preview on :4173)
npm run images    # Regenerate responsive images in public/img via sharp
```

## Architecture

Single-page portfolio built with React 19 + Vite + Tailwind CSS v4. No animation library — reveals use `IntersectionObserver` + CSS transitions.

**Routing:** `src/main.jsx` mounts `BrowserRouter` with two routes: `/` → `App`, `/admin` → lazily-loaded `admin/Admin.jsx`. `vercel.json` rewrites all paths to `index.html`.

**Page:** `src/App.jsx` composes `Navigation` → `Hero` → `Work` → `About` → `Background` → `Now` → `Notes` → `Contact` → `Footer`. Navigation uses anchor links (`#work`, `#about`, `#now`, `#notes`).

**Content — Supabase is the editor, `src/content/` is the fallback.** Every section reads its table through `useContent(table, fallback, build?)` / `useSite(fallback)` in `src/lib/useContent.js`: the compiled-in rows render on first paint and are replaced only by a non-empty remote result, so a paused or unreachable Supabase never blanks the page. Each `src/content/*.js` file mirrors its table's column names exactly. Tables: `site` (single row: hero, about, contact fields), `projects` (`featured` hides a row; `visual` picks the CSS treatment when `image_url` is empty), `experience`, `education`, `skills` (`group` clusters them), `now_items` (`category` = working | learning | exploring), `notes` (a `url` turns a draft row into a link), `contact_messages`. RLS: public read, authenticated non-anonymous write.

**Admin (`src/admin/`):** `Admin.jsx` is the shell + login. `CrudTab.jsx` is one config-driven editor for every list table (add / edit / delete / ↑↓ reorder that renumbers `sort_order`); configs live in `tabs.js`. `SiteTab.jsx` upserts the single `site` row. `MessagesTab.jsx` reads the inbox. `ui.jsx` holds the primitives, styled with the same tokens as the site. Migrations were applied through the Supabase MCP (`portfolio_redesign_content`, `seed_redesign_content`) — there is no local migrations folder.

**Primitives:** `components/Section.jsx` (full-width band, page gutter, 12-column header with mono index + display title), `components/Reveal.jsx` (the only component allowed to hide content; falls back to visible on no-IO, reduced motion, or after 2.5s), `components/ProjectRow.jsx` + `ProjectVisual.jsx` (editorial case-study row; CSS/SVG abstract visual keyed by `project.visual` when there is no real screenshot).

**Styling:** Tailwind v4 via `@tailwindcss/vite`. Tokens live in the `@theme` block in `src/index.css`: paper `#F2F1ED`, ink `#11110F`, ink-2 `#6D6C67`, rule `#C9C8C2`, accent `#FF4D00` (used sparingly). Fonts: Archivo (display + body) and JetBrains Mono (metadata) from Google Fonts. `.display` (uppercase, 800, tight) and `.meta` (mono, 11px, uppercase) set type only — colour is always a utility. `--spacing-gutter` is the single responsive page gutter (`px-gutter`). Small/zero radius, 1px rules, no shadows.

**Tailwind v4 gotcha:** `col-span-*` emits the `grid-column` shorthand, so a `lg:col-span-*` will reset an `md:col-start-*`. Always pair span and start within the same breakpoint.

**Static assets:** `public/img/` holds responsive portrait renditions (avif/webp/jpg), `public/filip-galach-cv.pdf`, `public/favicon.svg`, `public/og.jpg`.

## Conventions

2-space indent, no semicolons, `kebab-case` files, `PascalCase` components. Copy is Filip's own — don't invent clients, metrics or project results.
