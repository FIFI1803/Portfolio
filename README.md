# Portfolio — Filip Galach

Personal portfolio site for a Software Developer based in Dublin. React 19 +
Vite + Tailwind CSS v4 + GSAP, with a small Supabase-backed CMS and an
authenticated admin panel.

Content is baked into the HTML at build time, so the deployed page is fully
readable by search engines and link scrapers rather than assembling itself
after three client-side round-trips.

## Quick start

```bash
npm install
cp .env.example .env    # optional — see Environment below
npm run dev
```

The dev server runs on <http://localhost:5173>. The site renders without any
environment variables; only the contact form and `/admin` need them.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Production build, then prerender + `robots.txt` / `sitemap.xml` |
| `npm run preview` | Serve the production build locally on :4173 |
| `npm run sync:content` | Refresh `src/data/content.json` from Supabase |
| `npm run lint` | ESLint |

## Environment

All variables are optional. Copy `.env.example` to `.env` to set them.

| Variable | Purpose |
| --- | --- |
| `VITE_SITE_URL` | Production origin used for canonical, Open Graph and sitemap URLs. Must be absolute, no trailing slash. |
| `VITE_SUPABASE_URL` | Supabase project URL — contact form, `/admin`, `sync:content`. |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key. |

Without Supabase credentials the site still builds and renders from the
committed content snapshot; the contact form and admin panel report that they
are unavailable instead of failing silently.

## Updating content

Content lives in Supabase, but the site reads a **committed snapshot** at
`src/data/content.json` so that builds are reproducible and a Supabase outage
can't empty the page.

After editing anything in `/admin`:

```bash
npm run sync:content
git commit -am "Update content snapshot"
```

Skipping this leaves the deployed site serving the previous snapshot.

## Project structure

```
scripts/          Build tooling — content sync, prerender, shared site URL
src/
  sections/       Page sections (Hero, About, Skills, Experience, Projects, Contact)
  components/     Shared UI (Navigation, Marquee, Cursor)
  hooks/          useCollection, useReducedMotion
  lib/            Supabase client
  data/           content.json — build-time CMS snapshot
  admin/          Supabase-authenticated CMS panel (lazy-loaded)
  entry-server.jsx  Server entry, used only by the prerender step
public/           Static assets — images, CV, favicon, OG image
```

## How the build works

1. `vite build` produces the client bundle. The admin panel is code-split, so
   visitors never download it.
2. `scripts/prerender.mjs` SSR-builds `src/entry-server.jsx`, renders the page
   to HTML, and injects it into `dist/index.html`.
3. The client hydrates that markup instead of discarding it.
4. The same script writes `robots.txt` and `sitemap.xml` using `VITE_SITE_URL`.

## Accessibility

The site honours `prefers-reduced-motion` in both CSS and GSAP, ships a skip
link, and uses a visible focus ring throughout.

One known gap: the `muted` text colour sits at 2.94:1 against the background,
below the WCAG AA minimum of 4.5:1. It is scheduled for the design pass.

## Deployment

Deployed on Vercel. `vercel.json` rewrites all paths to `index.html` for
client-side routing. Set `VITE_SITE_URL` and the Supabase variables in the
Vercel project settings.
