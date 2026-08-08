# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev            # Start dev server (Vite HMR)
npm run build          # Production build + prerender + robots/sitemap
npm run preview        # Preview production build locally
npm run sync:content   # Refresh src/data/content.json from Supabase
npm run lint           # Run ESLint
```

No test suite is configured.

`npm run lint` currently reports 5 pre-existing `react-hooks/set-state-in-effect`
errors in `src/admin/Admin.jsx`. They predate the current work — treat any
additional error as one you introduced.

## Architecture

Single-page portfolio built with React 19 + Vite + Tailwind CSS v4 + GSAP,
with a Supabase-backed CMS and admin panel.

**Routes** (`src/main.jsx`): `/` renders `App`; `/admin` renders the admin panel,
which is `React.lazy`-loaded so it stays out of the visitor bundle.

**Layout:** `src/App.jsx` composes the sections in order — `Navigation`, then
`Hero`, `About`, `Skills`, `Experience`, `Projects`, `Contact` inside `<main>`,
separated by `Marquee` strips. No routing between sections; navigation uses
anchor links (`#home`, `#about`, …).

```
src/
  sections/    Page sections (Hero, About, Skills, Experience, Projects, Contact)
  components/  Shared UI (Navigation, Marquee, Cursor)
  hooks/       useCollection, useReducedMotion
  lib/         supabase client
  data/        content.json — build-time CMS snapshot (committed)
  admin/       Supabase-authenticated CMS panel
```

### Content pipeline

Site content lives in Supabase but **is not fetched at runtime**. Instead:

1. `npm run sync:content` (`scripts/fetch-content.mjs`) pulls the `projects`,
   `skills`, `education` and `experience` tables into `src/data/content.json`.
2. Components read that snapshot through `useCollection(table)`.
3. `npm run build` prerenders the page (`scripts/prerender.mjs`), so the shipped
   HTML contains the real content.

The snapshot is committed deliberately: builds stay reproducible and a Supabase
outage cannot empty the site. `useCollection` falls back to a client-side fetch
only when a collection is empty in the snapshot, which keeps a fresh clone
working before anyone has run the sync.

**When content changes in the admin panel, `npm run sync:content` must be re-run
and the result committed**, otherwise the deployed site keeps serving the old
snapshot.

### Prerendering

`scripts/prerender.mjs` runs after `vite build`: it SSR-builds
`src/entry-server.jsx`, renders `App` to HTML, and injects it into
`dist/index.html`. `src/main.jsx` then calls `hydrateRoot` instead of
`createRoot` when it finds prerendered markup on `/`.

Anything rendered during that pass must be deterministic — non-deterministic
output (random values, `Date.now()`, reading `window` during render) causes a
hydration mismatch. Effects do not run during prerender, so GSAP and other
browser-only work is safe where it already lives.

The same script emits `dist/robots.txt` and `dist/sitemap.xml`.

### Environment

All variables are optional; see `.env.example`.

- `VITE_SITE_URL` — production origin for canonical/OG/sitemap URLs. Falls back
  to the constant in `scripts/site.mjs`, shared with `vite.config.js` so the
  meta tags and the sitemap cannot drift.
- `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` — required only for the contact
  form, `/admin`, and `sync:content`. `src/lib/supabase.js` exports `null` when
  they are absent rather than throwing, so the static site still renders; call
  sites must guard on it.

### Styling

Tailwind CSS v4 via the `@tailwindcss/vite` plugin (not PostCSS). Design tokens
are declared in the `@theme` block in `src/index.css`: an ember/obsidian dark
palette (`--color-ember`, `--color-obsidian`, `--color-surface`, …) with
`Syne` for headings (`font-syne`) and `DM Sans` for body (`font-dm`).

Known issue: `--color-muted` (`#5A5A7A`) is **2.94:1** against `--color-obsidian`,
below the WCAG AA 4.5:1 minimum, and is used ~49 times. Scheduled for the
design phase — do not spread it further.

### Animations

GSAP with ScrollTrigger, registered once at the top of `App.jsx`. Each section
manages its own animations in `useEffect` via `gsap.context()` scoped to a ref,
reverting on cleanup. Sections that read from `useCollection` gate their
timeline on `status` so animations build against real content.

Motion respects `prefers-reduced-motion`:

- **CSS** — a `@media (prefers-reduced-motion: reduce)` block in `index.css`
  neutralises CSS animations and transitions (marquee, pulse, smooth scroll).
- **GSAP** — `App.jsx` sets `gsap.globalTimeline.timeScale(1000)`, so tweens
  resolve to their end state within a frame, and skips the ambient glow and
  heading scramble entirely.

The GSAP approach is a deliberate stopgap covering all sections at once; the
planned motion pass replaces it with per-animation `gsap.matchMedia()`.

**Do not reintroduce scroll hijacking.** An earlier scroll-snap assist that
yanked the page to section boundaries was removed on purpose.

**Static assets:** files in `public/` are served from the root — `HeroImage.png`,
the CV PDF, `favicon.svg`, `og-image.png`, `apple-touch-icon.png`.
