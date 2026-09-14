# Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `filipgalach.dev` as a warm-light, monochrome, work-led portfolio whose sections cannot render empty, and which loads under 160 kB gzip.

**Architecture:** A local-first content layer compiles all copy into the bundle and lets Supabase override it in the background, so a paused database degrades to nothing visible. A small primitives layer (`Section`, `Reveal`, `Prose`, `CaseRow`) carries the design system; six section components consume it. GSAP is removed entirely and reveals run on `IntersectionObserver` + CSS transitions.

**Tech Stack:** React 19, Vite 7, Tailwind CSS v4 (`@tailwindcss/vite`), Supabase JS v2, Vitest + Testing Library (new), Playwright (new), sharp (new, build-time only).

**Spec:** `docs/superpowers/specs/2026-09-09-portfolio-redesign-design.md`

## Global Constraints

- **No accent colour.** Colour on the page comes only from project screenshots. Never introduce a brand hue.
- **Palette tokens, exact values.** Light: `--paper #F8F7F4`, `--paper-2 #F1EFEA`, `--ink #12120F`, `--ink-2 #4A4945`, `--ink-3 #6E6C65`, `--rule #DEDBD3`. Dark: `--noir #0C0C0A`, `--noir-2 #171714`, `--noir-ink #F5F4F0`, `--noir-ink-2 #A5A39B`, `--noir-ink-3 #7C7A73`, `--noir-rule #2A2A26`.
- **Fonts.** Display = Instrument Serif (400 + italic), never below 28 px. UI/body = Inter Tight (400/500/600). Metadata = JetBrains Mono (400/500).
- **Section grounds.** Hero light, Work dark, At SAP light, About light, Stack light, Contact dark.
- **Only `Reveal` may hide content.** No other component sets `opacity: 0`, `visibility: hidden`, or a hiding transform. CSS must never hide content without JavaScript having run.
- **Banned patterns** (all were audit findings): numbered section eyebrows (`01 /`), pulsing availability dots, "Scroll to explore", ↗/↘ glyphs, count-up statistics, proficiency bars, tech marquees, custom cursors, "Screenshot coming soon" placeholders.
- **Copy rule.** Every claim must be traceable to `~/Desktop/Areas/Career/Filip Galach Resume.pdf`. No abstract-noun filler ("thoughtful", "clarity, reliability, and purpose"). Never invent a metric.
- **Budgets.** Public-route JS ≤ 160 kB gzip. Total images ≤ 500 kB.
- **Style.** 2-space indent, no semicolons, `kebab-case` files for non-components, `PascalCase` for components.
- **Commits.** Imperative, under 72 chars, ending with `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`.
- **Branch.** All work lands on `feat/portfolio-redesign`.

---

### Task 1: Code health — remove GSAP, dead code, and lint errors

**Files:**
- Delete: `src/Cursor.jsx`, `src/Marquee.jsx`
- Move: `brandguidelines.html` → `docs/brandguidelines.html`
- Modify: `src/main.jsx`, `src/admin/Admin.jsx`, `package.json`

**Interfaces:**
- Consumes: nothing
- Produces: an `Admin` route loaded via `React.lazy`, so later bundle checks can assert a separate chunk. No new exports.

- [ ] **Step 1: Remove dead files**

```bash
cd ~/Desktop/Projects/Portfolio
git rm -q src/Cursor.jsx src/Marquee.jsx
git mv brandguidelines.html docs/brandguidelines.html
```

GSAP stays installed for now. Every remaining section file still imports it,
and they are only replaced across Tasks 7-12. Task 13 uninstalls it once the
last consumer is gone, so the build never breaks mid-plan.

- [ ] **Step 2: Lazy-load the admin route**

Replace `src/main.jsx` entirely:

```jsx
import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

const Admin = lazy(() => import('./admin/Admin.jsx'))

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route
          path="/admin"
          element={
            <Suspense fallback={null}>
              <Admin />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
```

- [ ] **Step 3: Fix the 5 lint errors in Admin.jsx**

There are five occurrences of this pattern, at roughly lines 148, 236, 310, 393 and 476:

```jsx
useEffect(() => { load() }, [])
```

The rule `react-hooks/set-state-in-effect` fires because `load()` calls `setState` synchronously in the effect body. Fix each by deferring the call so the setState lands in a callback rather than the effect body:

```jsx
useEffect(() => {
  let cancelled = false
  const run = async () => {
    const { data } = await supabase.from(TABLE).select('*').order('sort_order')
    if (!cancelled) setItems(data || [])
  }
  run()
  return () => { cancelled = true }
}, [])
```

Apply the same shape to each of the five, substituting the table name and setter already used at that site. The `cancelled` flag also fixes a real bug: these effects currently set state after unmount.

- [ ] **Step 4: Verify lint and build are clean**

Run: `npm run lint && npm run build`
Expected: lint reports **0 errors**. Build succeeds and prints **two** JS chunks, one containing the admin panel.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: remove dead code, lazy-load admin, fix lint errors

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 2: Assets — CV, images, favicon, meta

**Files:**
- Create: `scripts/optimize-images.mjs`, `public/filip-galach-cv.pdf`, `public/favicon.svg`, `public/og.jpg`
- Create: `public/img/portrait-hero.{avif,webp,jpg}`, `public/img/portrait-about.{avif,webp,jpg}`
- Delete: `public/HeroImage.png`, `public/JPEG image.png`, `public/.DS_Store`
- Modify: `index.html`, `package.json`

**Interfaces:**
- Consumes: nothing
- Produces: image basenames `/img/portrait-hero` and `/img/portrait-about`, each with `.avif`, `.webp` and `.jpg` variants at widths 640/1280/1920. Sections in Tasks 7 and 10 reference these exact paths. CV lives at `/filip-galach-cv.pdf`.

- [ ] **Step 1: Copy in the real CV**

```bash
cp "$HOME/Desktop/Areas/Career/Filip Galach Resume.pdf" public/filip-galach-cv.pdf
ls -la public/filip-galach-cv.pdf
```

Expected: ~100 kB PDF present. This is finding F1.

- [ ] **Step 2: Install sharp and write the optimiser**

```bash
npm i -D sharp
mkdir -p scripts public/img
```

Create `scripts/optimize-images.mjs`:

```js
import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'

const WIDTHS = [640, 1280, 1920]
const SOURCES = [
  { src: 'public/HeroImage.png', name: 'portrait-hero' },
  { src: 'public/JPEG image.png', name: 'portrait-about' },
]

await mkdir('public/img', { recursive: true })

for (const { src, name } of SOURCES) {
  const meta = await sharp(src).metadata()
  for (const w of WIDTHS) {
    if (w > meta.width) continue
    const base = sharp(src).resize({ width: w, withoutEnlargement: true })
    await base.clone().avif({ quality: 55 }).toFile(`public/img/${name}-${w}.avif`)
    await base.clone().webp({ quality: 72 }).toFile(`public/img/${name}-${w}.webp`)
    await base.clone().jpeg({ quality: 78, mozjpeg: true }).toFile(`public/img/${name}-${w}.jpg`)
  }
  console.log(`${name}: source ${meta.width}x${meta.height}`)
}
```

Add to `package.json` scripts: `"images": "node scripts/optimize-images.mjs"`.

- [ ] **Step 3: Run it and check the budget**

```bash
npm run images
du -sh public/img
```

Expected: `public/img` total well under 500 kB. If it exceeds, drop the 1920 width and lower AVIF quality to 45.

- [ ] **Step 4: Remove the originals**

```bash
git rm -q "public/JPEG image.png" public/HeroImage.png
rm -f public/.DS_Store src/.DS_Store .DS_Store
echo ".DS_Store" >> .gitignore
```

- [ ] **Step 5: Add a favicon**

Create `public/favicon.svg` — a monochrome wordmark consistent with the design system, no accent colour:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="12" fill="#12120F"/>
  <text x="32" y="43" font-family="Georgia, serif" font-size="34"
        fill="#F8F7F4" text-anchor="middle">F</text>
</svg>
```

- [ ] **Step 6: Rewrite the document head**

Replace the `<head>` of `index.html`:

```html
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <title>Filip Galach — Software Developer, Dublin</title>
  <meta name="description" content="Software developer at SAP Ireland building internal Fiori applications with SAP UI5, JavaScript and OData. Based in Dublin." />
  <link rel="canonical" href="https://filipgalach.dev/" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://filipgalach.dev/" />
  <meta property="og:title" content="Filip Galach — Software Developer, Dublin" />
  <meta property="og:description" content="Software developer at SAP Ireland building internal Fiori applications with SAP UI5, JavaScript and OData." />
  <meta property="og:image" content="https://filipgalach.dev/og.jpg" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
</head>
```

- [ ] **Step 7: Generate the OG image**

```bash
node -e "
import('sharp').then(async ({default: sharp}) => {
  await sharp('public/img/portrait-hero-1280.jpg')
    .resize(1200, 630, { fit: 'cover', position: 'top' })
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile('public/og.jpg')
})"
ls -la public/og.jpg
```

- [ ] **Step 8: Verify the CV actually serves**

```bash
npm run build && npx vite preview --port 4173 &
sleep 4
curl -sI http://localhost:4173/filip-galach-cv.pdf | head -3
```

Expected: `content-type: application/pdf`, **not** `text/html`. This is the regression test for F1.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: add real CV, optimised images, favicon and meta

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 3: Design tokens and typography

**Files:**
- Rewrite: `src/index.css`

**Interfaces:**
- Produces: Tailwind utilities `bg-paper`, `bg-paper-2`, `text-ink`, `text-ink-2`, `text-ink-3`, `border-rule`, `bg-noir`, `bg-noir-2`, `text-noir-ink`, `text-noir-ink-2`, `text-noir-ink-3`, `border-noir-rule`, plus `font-display`, `font-sans`, `font-mono`. Also the classes `.measure` and the `[data-reveal]` transition contract used by Task 4.

- [ ] **Step 1: Replace `src/index.css` entirely**

```css
@import url("https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter+Tight:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap");
@import "tailwindcss";

@theme {
  --color-paper:      #F8F7F4;
  --color-paper-2:    #F1EFEA;
  --color-ink:        #12120F;
  --color-ink-2:      #4A4945;
  --color-ink-3:      #6E6C65;
  --color-rule:       #DEDBD3;

  --color-noir:       #0C0C0A;
  --color-noir-2:     #171714;
  --color-noir-ink:   #F5F4F0;
  --color-noir-ink-2: #A5A39B;
  --color-noir-ink-3: #7C7A73;
  --color-noir-rule:  #2A2A26;

  --font-display: 'Instrument Serif', Georgia, 'Times New Roman', serif;
  --font-sans:    'Inter Tight', system-ui, -apple-system, sans-serif;
  --font-mono:    'JetBrains Mono', ui-monospace, SFMono-Regular, monospace;
}

html {
  scroll-behavior: smooth;
  scroll-padding-top: 5rem;
  -webkit-text-size-adjust: 100%;
}

body {
  margin: 0;
  background-color: #F8F7F4;
  color: #4A4945;
  font-family: 'Inter Tight', system-ui, sans-serif;
  font-size: 17px;
  line-height: 1.65;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

::selection { background: #12120F; color: #F8F7F4; }

/* Caps the measure at roughly 68 characters. */
.measure { max-width: 34em; }

/* Display type is optically large; tighten it and pull the leading in. */
.display {
  font-family: 'Instrument Serif', Georgia, serif;
  font-weight: 400;
  letter-spacing: -0.015em;
  line-height: 1.02;
  color: #12120F;
}

/* Metadata: mono, small, never shouty. Not an eyebrow label. */
.meta {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 12px;
  letter-spacing: 0.02em;
  color: #6E6C65;
}

/*
  Reveal contract. The hidden state is applied ONLY when JavaScript sets
  data-reveal="out" — CSS never hides content on its own. See spec 3.5.
*/
[data-reveal] {
  transition:
    opacity 0.7s cubic-bezier(0.22, 0.61, 0.24, 1),
    transform 0.7s cubic-bezier(0.22, 0.61, 0.24, 1);
}
[data-reveal="out"] { opacity: 0; transform: translateY(20px); }
[data-reveal="in"]  { opacity: 1; transform: none; }

input, textarea, select, button { font: inherit; }

:focus-visible {
  outline: 2px solid #12120F;
  outline-offset: 2px;
  border-radius: 1px;
}
.on-noir :focus-visible { outline-color: #F8F7F4; }

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  [data-reveal],
  [data-reveal="out"],
  [data-reveal="in"] {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 2: Verify tokens compile**

Run: `npm run build && grep -c "F8F7F4" dist/assets/*.css`
Expected: build succeeds, count ≥ 1. Confirms `@theme` emitted the palette.

- [ ] **Step 3: Confirm no accent colour survived**

```bash
grep -iE "8BA8FF|FF5C2B|7FFFD4|FFD166" dist/assets/*.css || echo "CLEAN — no accent colour"
```

Expected: `CLEAN`. Enforces the global no-accent constraint.

- [ ] **Step 4: Commit**

```bash
git add src/index.css
git commit -m "feat: replace design tokens with monochrome warm-light system

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 4: Local-first content layer

This is the fix for F2, the worst defect. It gets real tests because it has real logic.

**Files:**
- Create: `src/content/projects.js`, `src/content/experience.js`, `src/content/education.js`, `src/content/skills.js`, `src/content/index.js`
- Create: `src/lib/useContent.js`, `src/lib/useContent.test.js`
- Create: `vitest.config.js`
- Modify: `package.json`

**Interfaces:**
- Consumes: `src/lib/supabase.js` (unchanged)
- Produces:
  - `useContent(table, fallback)` → returns an array. Always returns `fallback` synchronously on first render; replaces it with remote rows only when the query resolves with a **non-empty** array.
  - `src/content/index.js` exports `projects`, `experience`, `education`, `skills` — arrays whose shapes match the existing Supabase columns so `Admin.jsx` keeps working.

- [ ] **Step 1: Install the test toolchain**

```bash
npm i -D vitest @testing-library/react @testing-library/dom @testing-library/jest-dom jsdom
```

Create `vitest.config.js`:

```js
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.js'],
  },
})
```

Create `vitest.setup.js` — Task 5 uses `toHaveAttribute`, which only exists
once jest-dom's matchers are registered:

```js
import '@testing-library/jest-dom/vitest'
```

Add to `package.json` scripts: `"test": "vitest run"`.

- [ ] **Step 2: Write the failing test**

Create `src/lib/useContent.test.js`:

```js
import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useContent } from './useContent'

const mockSelect = vi.fn()
vi.mock('./supabase', () => ({
  supabase: { from: () => ({ select: () => ({ order: (...a) => mockSelect(...a) }) }) },
}))

const local = [{ id: 'local-1', name: 'Local Project' }]

describe('useContent', () => {
  beforeEach(() => mockSelect.mockReset())

  it('returns local content synchronously on first render', () => {
    mockSelect.mockReturnValue(new Promise(() => {}))
    const { result } = renderHook(() => useContent('projects', local))
    expect(result.current).toEqual(local)
  })

  it('replaces local content when remote returns rows', async () => {
    const remote = [{ id: 'remote-1', name: 'Remote Project' }]
    mockSelect.mockResolvedValue({ data: remote, error: null })
    const { result } = renderHook(() => useContent('projects', local))
    await waitFor(() => expect(result.current).toEqual(remote))
  })

  it('keeps local content when remote returns an empty array', async () => {
    mockSelect.mockResolvedValue({ data: [], error: null })
    const { result } = renderHook(() => useContent('projects', local))
    await new Promise(r => setTimeout(r, 20))
    expect(result.current).toEqual(local)
  })

  it('keeps local content when remote errors', async () => {
    mockSelect.mockResolvedValue({ data: null, error: { message: 'paused' } })
    const { result } = renderHook(() => useContent('projects', local))
    await new Promise(r => setTimeout(r, 20))
    expect(result.current).toEqual(local)
  })

  it('keeps local content when the query rejects', async () => {
    mockSelect.mockRejectedValue(new Error('network down'))
    const { result } = renderHook(() => useContent('projects', local))
    await new Promise(r => setTimeout(r, 20))
    expect(result.current).toEqual(local)
  })
})
```

- [ ] **Step 3: Run it and watch it fail**

Run: `npm test`
Expected: FAIL — `Failed to resolve import "./useContent"`.

- [ ] **Step 4: Implement the hook**

Create `src/lib/useContent.js`:

```js
import { useEffect, useState } from 'react'
import { supabase } from './supabase'

/**
 * Local-first content. The compiled-in `fallback` renders immediately and is
 * only ever replaced by a non-empty remote result. A paused, slow or erroring
 * Supabase is therefore invisible to the visitor — see spec section 5 (F2).
 */
export const useContent = (table, fallback) => {
  const [items, setItems] = useState(fallback)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        const { data, error } = await supabase.from(table).select('*').order('sort_order')
        if (cancelled || error) return
        if (Array.isArray(data) && data.length > 0) setItems(data)
      } catch {
        // Offline, paused project, DNS failure — keep the local content.
      }
    }

    load()
    return () => { cancelled = true }
  }, [table])

  return items
}
```

- [ ] **Step 5: Run the tests again**

Run: `npm test`
Expected: **5 passed**.

- [ ] **Step 6: Write the content files**

Every line below traces to `~/Desktop/Areas/Career/Filip Galach Resume.pdf`. Do not add claims that are not in it.

Create `src/content/experience.js`:

```js
export const experience = [
  {
    id: 'sap',
    role: 'iXP Student — Software Developer',
    company: 'SAP',
    team: 'Software Asset Management (SAM)',
    period: 'Dec 2024 — Present',
    location: 'Dublin, Ireland',
    sort_order: 1,
    highlights: [
      {
        title: 'Variable Management, IO Analysis Report (MVP2)',
        body: 'The brief asked for static filters. I proposed and built a system that lets users save and reuse their own filter combinations instead.',
      },
      {
        title: 'A 79-case UAT plan',
        body: 'Designed and executed it across edge cases, role-based access for SPM versus Finance, and UI validation — coordinating testing across multiple stakeholders.',
      },
      {
        title: 'Publisher 360 Dashboard',
        body: 'Currently leading front-end development of the publisher analytics view.',
      },
    ],
    detail: [
      'Forecasting application in SAP UI5 — MVC architecture, OData services, notification strips with conditional logic for open and frozen forecast periods',
      'Rolling 4-period fiscal history filters, asynchronous OData calls with Promise handling, front-end validation before backend submission',
      'Agile/Scrum — bi-daily stand-ups, monthly sprint planning, retrospectives',
      'Deployed on SAP BTP Cloud Foundry',
    ],
  },
  {
    id: 'ssp',
    role: 'Duty Manager',
    company: 'SSP Ireland & UK',
    team: null,
    period: 'May 2022 — Jul 2024',
    location: 'Dublin, Ireland',
    sort_order: 2,
    highlights: [],
    detail: [
      'Supervised and trained a team of 10; ran daily operations including stock control, cash reconciliation and health & safety compliance',
      'Resolved customer complaints and held service standards across high-volume shifts',
    ],
  },
]
```

Create `src/content/projects.js`. Every project here is verified from the CV or from this repository; `image_url: null` renders the typographic fallback from Task 8:

```js
export const projects = [
  {
    id: 'forever',
    name: 'FOREVER',
    kind: 'Full-stack web application',
    year: '2026',
    sort_order: 1,
    problem: 'I wanted one project that proved I could carry a feature the whole way down the stack, not just style a front end.',
    built: 'A full-stack e-commerce application — front-end design, back-end logic and database integration, built and wired together end to end.',
    outcome: 'The reference project I point at when someone asks whether I can work outside a framework someone else set up.',
    tags: ['React', 'Node.js', 'Supabase', 'PostgreSQL'],
    image_url: null,
    link: null,
  },
  {
    id: 'portfolio',
    name: 'This site',
    kind: 'React · Tailwind · Supabase · Vercel',
    year: '2026',
    sort_order: 2,
    problem: 'Editing a portfolio meant a code change and a redeploy every time, which meant it never got updated.',
    built: 'A custom CMS behind an authenticated admin route, so projects, experience, skills and contact messages are all editable live. The content layer is local-first — the site renders fully even when the database is asleep.',
    outcome: 'Content changes take seconds and no deploy. Deployed on Vercel at filipgalach.dev.',
    tags: ['React 19', 'Tailwind v4', 'Supabase', 'Vercel'],
    image_url: null,
    link: 'https://filipgalach.dev',
  },
  {
    id: 'homelab',
    name: 'Homelab',
    kind: 'Self-hosted infrastructure',
    year: '2025 — ongoing',
    sort_order: 3,
    problem: 'Reading about containers and networking was not teaching me how they actually break.',
    built: 'A self-hosted Proxmox homelab running Docker, Portainer and Tailscale — services I administer, expose and repair myself.',
    outcome: 'Where the cloud fundamentals behind AZ-900 stopped being theory.',
    tags: ['Proxmox', 'Docker', 'Portainer', 'Tailscale', 'Linux'],
    image_url: null,
    link: null,
  },
]
```

Create `src/content/skills.js` — grouped exactly as the CV groups them:

```js
export const skills = [
  { id: 'lang', group: 'Languages', sort_order: 1,
    items: ['JavaScript', 'TypeScript', 'Python', 'SQL', 'HTML', 'CSS'] },
  { id: 'fw', group: 'Frameworks & Libraries', sort_order: 2,
    items: ['SAP UI5', 'SAP Fiori', 'SAP CAP', 'React', 'Node.js'] },
  { id: 'plat', group: 'Platforms & Services', sort_order: 3,
    items: ['SAP BTP', 'Cloud Foundry', 'OData', 'Git', 'GitHub', 'Docker', 'Linux', 'Vercel'] },
  { id: 'tools', group: 'Developer Tools', sort_order: 4,
    items: ['SAP Business Application Studio', 'VS Code', 'Jira', 'Proxmox', 'Portainer'] },
  { id: 'method', group: 'Methodologies', sort_order: 5,
    items: ['Agile', 'Scrum', 'Test-Driven Development', 'MVC Architecture'] },
]
```

Create `src/content/education.js`:

```js
export const education = [
  { id: 'apprenticeship', type: 'education', sort_order: 1,
    title: 'ICT Associate Professional — Level 6 Apprenticeship',
    subtitle: 'DDLETB Tallaght · FIT Apprenticeship Programme',
    period: 'Oct 2024 — Oct 2026', verify_url: null },
  { id: 'leaving-cert', type: 'education', sort_order: 2,
    title: 'Leaving Certificate',
    subtitle: 'Le Chéile Secondary School, Dublin',
    period: 'Sep 2017 — May 2022', verify_url: null },

  { id: 'az900', type: 'certification', sort_order: 1,
    title: 'Microsoft Certified: Azure Fundamentals (AZ-900)',
    subtitle: 'Microsoft', period: 'Jan 2026', verify_url: null },
  { id: 'ai-fund', type: 'certification', sort_order: 2,
    title: 'AI Fundamentals',
    subtitle: 'IBM SkillsBuild', period: 'Oct 2024', verify_url: null },
  { id: 'webdev', type: 'certification', sort_order: 3,
    title: 'Web Development Fundamentals',
    subtitle: 'IBM SkillsBuild', period: 'Aug 2024', verify_url: null },
  { id: 'gle-ai', type: 'certification', sort_order: 4,
    title: 'Guided Learning Experience in AI',
    subtitle: 'SkillUpOnline / IBM SkillsBuild', period: 'Jun — Dec 2024', verify_url: null },
  { id: 'python-100', type: 'certification', sort_order: 5,
    title: '100 Days of Code: Complete Python Pro Bootcamp',
    subtitle: 'Udemy · 58.5 hrs', period: 'Apr 2024', verify_url: null },
]
```

Create `src/content/index.js`:

```js
export { projects } from './projects'
export { experience } from './experience'
export { education } from './education'
export { skills } from './skills'

export const profile = {
  name: 'Filip Galach',
  role: 'Software Developer',
  employer: 'SAP',
  team: 'Software Asset Management',
  location: 'Dublin, Ireland',
  since: 'Dec 2024',
  email: 'filipgalach@gmail.com',
  linkedin: 'https://linkedin.com/in/filip-galach',
  github: 'https://github.com/FIFI1803',
  cv: '/filip-galach-cv.pdf',
}
```

- [ ] **Step 7: Verify the whole suite and build**

Run: `npm test && npm run build`
Expected: 5 tests pass, build succeeds.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: add local-first content layer with tests

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 5: Primitives — Section, Reveal, Prose

**Files:**
- Create: `src/components/Reveal.jsx`, `src/components/Reveal.test.jsx`, `src/components/Section.jsx`

**Interfaces:**
- Produces:
  - `<Reveal as="div" delay={0} className="">` — wraps children, reveals on intersection. **The only component permitted to hide content.**
  - `<Section id ground="light|dark" className="">` — full-bleed ground, centred `max-w-[1240px]` inner, responsive vertical padding. Adds `on-noir` to dark sections so the focus-ring rule in Task 3 applies.

  There is deliberately no `Prose` component: the `.measure` class from Task 3 already caps the line length, and a wrapper that only sets two classes would be indirection without benefit.

- [ ] **Step 1: Write the failing Reveal test**

Create `src/components/Reveal.test.jsx`:

```jsx
import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import Reveal from './Reveal'

afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals() })

describe('Reveal', () => {
  it('renders visible when IntersectionObserver is unavailable', () => {
    vi.stubGlobal('IntersectionObserver', undefined)
    render(<Reveal><p>content</p></Reveal>)
    expect(screen.getByText('content').parentElement).toHaveAttribute('data-reveal', 'in')
  })

  it('reveals when the observer reports intersection', async () => {
    let trigger
    vi.stubGlobal('IntersectionObserver', class {
      constructor(cb) { trigger = cb }
      observe() {} disconnect() {}
    })
    render(<Reveal><p>content</p></Reveal>)
    expect(screen.getByText('content').parentElement).toHaveAttribute('data-reveal', 'out')
    trigger([{ isIntersecting: true }])
    await waitFor(() =>
      expect(screen.getByText('content').parentElement).toHaveAttribute('data-reveal', 'in'))
  })

  it('reveals via the fallback timer if the observer never fires', async () => {
    vi.useFakeTimers()
    vi.stubGlobal('IntersectionObserver', class {
      constructor() {} observe() {} disconnect() {}
    })
    render(<Reveal><p>content</p></Reveal>)
    expect(screen.getByText('content').parentElement).toHaveAttribute('data-reveal', 'out')
    await vi.advanceTimersByTimeAsync(2600)
    expect(screen.getByText('content').parentElement).toHaveAttribute('data-reveal', 'in')
  })
})
```

- [ ] **Step 2: Run it and watch it fail**

Run: `npm test src/components/Reveal.test.jsx`
Expected: FAIL — cannot resolve `./Reveal`.

- [ ] **Step 3: Implement Reveal**

Create `src/components/Reveal.jsx`:

```jsx
import { useEffect, useRef, useState } from 'react'

const FALLBACK_MS = 2500

/**
 * Reveals children once they enter the viewport.
 *
 * Three guarantees, so no single failure can blank the page (spec 3.5):
 *   1. The hidden state is applied here in JS — CSS never hides on its own.
 *   2. No IntersectionObserver, or reduced motion, means visible immediately.
 *   3. A 2.5s timer reveals regardless, cleared when the observer fires.
 */
const Reveal = ({ children, as: Tag = 'div', delay = 0, className = '' }) => {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const node = ref.current
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

    if (!node || typeof IntersectionObserver === 'undefined' || reduced) {
      setShown(true)
      return
    }

    const timer = setTimeout(() => setShown(true), FALLBACK_MS)

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        clearTimeout(timer)
        setShown(true)
        io.disconnect()
      },
      { rootMargin: '0px 0px -10% 0px' },
    )
    io.observe(node)

    return () => { clearTimeout(timer); io.disconnect() }
  }, [])

  return (
    <Tag
      ref={ref}
      data-reveal={shown ? 'in' : 'out'}
      style={delay && !shown ? { transitionDelay: `${delay}ms` } : undefined}
      className={className}
    >
      {children}
    </Tag>
  )
}

export default Reveal
```

- [ ] **Step 4: Verify the tests pass**

Run: `npm test`
Expected: **8 passed** (5 from Task 4, 3 here).

- [ ] **Step 5: Implement Section**

Create `src/components/Section.jsx`:

```jsx
const GROUNDS = {
  light: 'bg-paper text-ink-2',
  dark: 'bg-noir text-noir-ink-2 on-noir',
}

const Section = ({ id, ground = 'light', className = '', children }) => (
  <section id={id} className={`w-full ${GROUNDS[ground]} ${className}`}>
    <div className="mx-auto w-full max-w-[1240px] px-6 py-24 md:px-10 md:py-32 lg:px-14 lg:py-40">
      {children}
    </div>
  </section>
)

export default Section
```

- [ ] **Step 6: Verify build**

Run: `npm test && npm run build`
Expected: 8 tests pass, build succeeds.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add Section and Reveal primitives

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 6: Navigation

**Files:**
- Rewrite: `src/Navigation.jsx`

**Interfaces:**
- Consumes: `profile` from `src/content/index.js`
- Produces: `<Navigation />`, default export. Links to `#work`, `#sap`, `#about`, `#contact` — Tasks 8–12 must use these exact `id`s.

- [ ] **Step 1: Rewrite the component**

Fixes F1 (CV href) and the accessibility gaps in §8. Note there is no availability dot and no numbered links.

```jsx
import { useEffect, useRef, useState } from 'react'
import { profile } from './content'

const links = [
  { label: 'Work', href: '#work' },
  { label: 'SAP', href: '#sap' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

const Navigation = () => {
  const [open, setOpen] = useState(false)
  const toggleRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key !== 'Escape') return
      setOpen(false)
      toggleRef.current?.focus()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className="sticky top-0 z-50 border-b border-rule bg-paper/85 backdrop-blur-md">
      <nav className="mx-auto flex h-20 max-w-[1240px] items-center justify-between px-6 md:px-10 lg:px-14">
        <a href="#top" className="font-display text-[22px] text-ink">
          Filip Galach
        </a>

        <div className="hidden items-center gap-9 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href}
               className="text-[15px] text-ink-2 transition-colors hover:text-ink">
              {l.label}
            </a>
          ))}
          <a href={profile.cv} download
             className="border border-ink px-4 py-2 text-[14px] text-ink transition-colors hover:bg-ink hover:text-paper">
            CV
          </a>
        </div>

        <button
          ref={toggleRef}
          type="button"
          className="md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen(v => !v)}
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </nav>

      <div id="mobile-menu" hidden={!open}
           className="border-t border-rule bg-paper md:hidden">
        {links.map((l) => (
          <a key={l.href} href={l.href} onClick={() => setOpen(false)}
             className="block border-b border-rule px-6 py-4 text-ink-2">
            {l.label}
          </a>
        ))}
        <a href={profile.cv} download className="block px-6 py-4 text-ink">
          Download CV
        </a>
      </div>
    </header>
  )
}

export default Navigation
```

- [ ] **Step 2: Verify the CV link points at a real file**

```bash
grep -n "filip-galach-cv" src/content/index.js && ls -la public/filip-galach-cv.pdf
```

Expected: both present. F1 closed end to end.

- [ ] **Step 3: Commit**

```bash
git add src/Navigation.jsx
git commit -m "feat: rebuild navigation with working CV link and a11y disclosure

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 7: Hero

**Files:**
- Create: `src/sections/Hero.jsx`
- Delete: `src/Hero.jsx`

**Interfaces:**
- Consumes: `profile`, `Reveal`, images `/img/portrait-hero-{640,1280,1920}.{avif,webp,jpg}`
- Produces: `<Hero />`, default export, rendering `id="top"`.

- [ ] **Step 1: Create the section**

No availability dot, no "Scroll to explore", no arrow glyphs. The claim is specific and traceable to the CV.

```jsx
import Reveal from '../components/Reveal'
import { profile } from '../content'

const Hero = () => (
  <div id="top" className="w-full bg-paper">
    <div className="mx-auto grid max-w-[1240px] gap-14 px-6 pb-24 pt-20 md:px-10 md:pb-32 md:pt-28 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-20 lg:px-14">
      <div>
        <Reveal>
          <h1 className="display text-[clamp(2.5rem,7.5vw,6.75rem)]">
            I build the internal tools
            <br />
            that SAP runs on.
          </h1>
        </Reveal>

        <Reveal delay={120}>
          <p className="measure mt-8 text-[17px] text-ink-2">
            Software developer on the Software Asset Management team at SAP
            Ireland, working in SAP UI5, JavaScript and OData. Currently leading
            front-end development of the Publisher 360 Dashboard.
          </p>
        </Reveal>

        <Reveal delay={200}>
          <p className="meta mt-8">
            {profile.role} · {profile.employer} {profile.team} · {profile.location} · since {profile.since}
          </p>
        </Reveal>

        <Reveal delay={260}>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a href="#work"
               className="bg-ink px-6 py-3 text-[15px] text-paper transition-opacity hover:opacity-85">
              See the work
            </a>
            <a href={profile.cv} download
               className="border border-rule px-6 py-3 text-[15px] text-ink transition-colors hover:border-ink">
              Download CV
            </a>
          </div>
        </Reveal>
      </div>

      <Reveal delay={160} className="lg:pb-2">
        <picture>
          <source
            type="image/avif"
            srcSet="/img/portrait-hero-640.avif 640w, /img/portrait-hero-1280.avif 1280w"
            sizes="(min-width: 1024px) 40vw, 100vw"
          />
          <source
            type="image/webp"
            srcSet="/img/portrait-hero-640.webp 640w, /img/portrait-hero-1280.webp 1280w"
            sizes="(min-width: 1024px) 40vw, 100vw"
          />
          <img
            src="/img/portrait-hero-1280.jpg"
            alt="Filip Galach"
            width="784"
            height="1332"
            loading="eager"
            decoding="async"
            className="w-full object-cover"
          />
        </picture>
      </Reveal>
    </div>
  </div>
)

export default Hero
```

- [ ] **Step 2: Remove the old file**

```bash
git rm -q src/Hero.jsx
```

- [ ] **Step 3: Verify no banned patterns remain**

```bash
grep -riE "scroll to explore|available for select|↗|↘|hero-badge" src/sections/Hero.jsx \
  || echo "CLEAN — no banned hero patterns"
```

Expected: `CLEAN`.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: rebuild hero with specific claim and responsive images

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 8: Work — CaseRow and the dark spine

**Files:**
- Create: `src/components/CaseRow.jsx`, `src/sections/Work.jsx`
- Delete: `src/Projects.jsx`

**Interfaces:**
- Consumes: `useContent`, `projects`, `Section`, `Reveal`
- Produces:
  - `<CaseRow project index flip />` where `project` matches the Task 4 shape (`name, kind, year, problem, built, outcome, tags, image_url, link`)
  - `<Work />`, default export, rendering `id="work"` on a dark ground

- [ ] **Step 1: Create CaseRow**

The `image_url: null` branch renders a typographic case study, never a "coming soon" placeholder.

```jsx
const CaseRow = ({ project, index, flip = false }) => (
  <article className="grid gap-10 border-t border-noir-rule pt-14 lg:grid-cols-2 lg:gap-16">
    <div className={flip ? 'lg:order-2' : ''}>
      {project.image_url ? (
        <img
          src={project.image_url}
          alt={`${project.name} interface`}
          loading="lazy"
          decoding="async"
          className="w-full border border-noir-rule bg-noir-2 object-cover"
        />
      ) : (
        <div className="flex aspect-[4/3] flex-col justify-between border border-noir-rule bg-noir-2 p-8">
          <span className="meta text-noir-ink-3">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="display text-[clamp(1.75rem,4vw,3rem)] text-noir-ink">
            {project.name}
          </span>
          <span className="meta text-noir-ink-3">{project.kind}</span>
        </div>
      )}
    </div>

    <div className={flip ? 'lg:order-1' : ''}>
      <p className="meta text-noir-ink-3">
        {String(index + 1).padStart(2, '0')} · {project.kind} · {project.year}
      </p>

      <h3 className="display mt-4 text-[clamp(2rem,4.5vw,3.25rem)] text-noir-ink">
        {project.name}
      </h3>

      <dl className="mt-8 space-y-5">
        {[
          ['Problem', project.problem],
          ['What I built', project.built],
          ['Outcome', project.outcome],
        ].map(([label, body]) => (
          <div key={label}>
            <dt className="meta text-noir-ink-3">{label}</dt>
            <dd className="measure mt-1 text-[16px] text-noir-ink-2">{body}</dd>
          </div>
        ))}
      </dl>

      <p className="meta mt-8 text-noir-ink-3">{project.tags.join('  ·  ')}</p>

      {project.link && (
        <a
          href={project.link}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-block border-b border-noir-ink-3 pb-1 text-[15px] text-noir-ink transition-colors hover:border-noir-ink"
        >
          Visit {project.name}
        </a>
      )}
    </div>
  </article>
)

export default CaseRow
```

- [ ] **Step 2: Create the Work section**

```jsx
import Section from '../components/Section'
import Reveal from '../components/Reveal'
import CaseRow from '../components/CaseRow'
import { useContent } from '../lib/useContent'
import { projects as localProjects } from '../content'

const Work = () => {
  const projects = useContent('projects', localProjects)

  return (
    <Section id="work" ground="dark">
      <Reveal>
        <h2 className="display text-[clamp(2.25rem,6vw,4.5rem)] text-noir-ink">
          Selected work
        </h2>
        <p className="measure mt-6 text-[17px] text-noir-ink-2">
          Three things I built end to end, and what each one was actually for.
        </p>
      </Reveal>

      <div className="mt-20 space-y-24">
        {projects.map((project, i) => (
          <Reveal key={project.id}>
            <CaseRow project={project} index={i} flip={i % 2 === 1} />
          </Reveal>
        ))}
      </div>
    </Section>
  )
}

export default Work
```

- [ ] **Step 3: Remove the old file**

```bash
git rm -q src/Projects.jsx
```

- [ ] **Step 4: Verify the placeholder is gone**

```bash
grep -ri "coming soon" src/ || echo "CLEAN — no placeholder states"
```

Expected: `CLEAN`. Closes D7.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: rebuild work section as dark full-width case rows

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 9: At SAP

**Files:**
- Create: `src/sections/Sap.jsx`
- Delete: `src/Experience.jsx`

**Interfaces:**
- Consumes: `useContent`, `experience`, `Section`, `Reveal`
- Produces: `<Sap />`, default export, rendering `id="sap"`

- [ ] **Step 1: Create the section**

Promotes the three strongest wins to headline position, closing D5.

```jsx
import Section from '../components/Section'
import Reveal from '../components/Reveal'
import { useContent } from '../lib/useContent'
import { experience as localExperience } from '../content'

const Sap = () => {
  const roles = useContent('experience', localExperience)
  const sap = roles.find(r => r.id === 'sap') ?? roles[0]
  const rest = roles.filter(r => r !== sap)

  return (
    <Section id="sap" ground="light">
      <Reveal>
        <p className="meta">{sap.period} · {sap.location}</p>
        <h2 className="display mt-4 text-[clamp(2.25rem,6vw,4.5rem)]">
          At SAP
        </h2>
        <p className="measure mt-6 text-[17px] text-ink-2">
          {sap.role} on the {sap.team} team, building internal Fiori
          applications used across the business.
        </p>
      </Reveal>

      <div className="mt-16 grid gap-12 lg:grid-cols-3">
        {sap.highlights.map((h, i) => (
          <Reveal key={h.title} delay={i * 80}>
            <div className="border-t border-rule pt-6">
              <h3 className="display text-[26px]">{h.title}</h3>
              <p className="mt-3 text-[16px] text-ink-2">{h.body}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <ul className="mt-16 space-y-3 border-t border-rule pt-8">
          {sap.detail.map(d => (
            <li key={d} className="meta measure text-ink-3">{d}</li>
          ))}
        </ul>
      </Reveal>

      {rest.map(role => (
        <Reveal key={role.id}>
          <div className="mt-16 border-t border-rule pt-8">
            <p className="meta">{role.period} · {role.location}</p>
            <h3 className="display mt-2 text-[26px]">
              {role.role} — {role.company}
            </h3>
            <ul className="mt-4 space-y-2">
              {role.detail.map(d => (
                <li key={d} className="measure text-[16px] text-ink-2">{d}</li>
              ))}
            </ul>
          </div>
        </Reveal>
      ))}
    </Section>
  )
}

export default Sap
```

- [ ] **Step 2: Remove the old file and verify**

```bash
git rm -q src/Experience.jsx
npm run build
```

Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: rebuild SAP section leading with the strongest wins

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 10: About

**Files:**
- Create: `src/sections/About.jsx`
- Delete: `src/About.jsx`

**Interfaces:**
- Consumes: `Section`, `Reveal`, images `/img/portrait-about-*`
- Produces: `<About />`, default export, rendering `id="about"`

- [ ] **Step 1: Create the section**

Four sentences in Filip's voice. No stats row, no count-ups, no greyscale filter — closing D3 and D4.

```jsx
import Section from '../components/Section'
import Reveal from '../components/Reveal'

const About = () => (
  <Section id="about" ground="light" className="border-t border-rule">
    <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
      <Reveal>
        <picture>
          <source
            type="image/avif"
            srcSet="/img/portrait-about-640.avif 640w, /img/portrait-about-1280.avif 1280w"
            sizes="(min-width: 1024px) 40vw, 100vw"
          />
          <source
            type="image/webp"
            srcSet="/img/portrait-about-640.webp 640w, /img/portrait-about-1280.webp 1280w"
            sizes="(min-width: 1024px) 40vw, 100vw"
          />
          <img
            src="/img/portrait-about-1280.jpg"
            alt="Filip Galach"
            width="1280"
            height="853"
            loading="lazy"
            decoding="async"
            className="w-full object-cover"
          />
        </picture>
      </Reveal>

      <div>
        <Reveal>
          <h2 className="display text-[clamp(2.25rem,6vw,4.5rem)]">About</h2>
        </Reveal>

        <Reveal delay={80}>
          <div className="measure mt-8 space-y-5 text-[17px] text-ink-2">
            <p>
              I'm 22, based in Dublin, and two years into an ICT Associate
              Professional apprenticeship at DDLETB Tallaght — a Level 6
              programme that puts me in college and at SAP at the same time.
            </p>
            <p>
              Before this I spent two years as a Duty Manager at SSP, running
              shifts and a team of ten. I moved into software through
              self-study and IBM SkillsBuild certifications, and the
              management job turned out to be better preparation than I
              expected — most of the work is still communication.
            </p>
            <p>
              Outside the office I run a Proxmox homelab on Docker, Portainer
              and Tailscale, which is where most of what I know about
              networking and containers actually came from.
            </p>
          </div>
        </Reveal>
      </div>
    </div>
  </Section>
)

export default About
```

- [ ] **Step 2: Remove the old file**

```bash
git rm -q src/About.jsx
```

- [ ] **Step 3: Verify the banned patterns are gone**

```bash
grep -riE "about-stat|grayscale|languages spoken|data-target" src/ \
  || echo "CLEAN — no vanity stats or greyscale portrait"
```

Expected: `CLEAN`.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: rebuild about section, drop vanity stats

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 11: Stack and credentials

**Files:**
- Create: `src/sections/Stack.jsx`
- Delete: `src/Skills.jsx`

**Interfaces:**
- Consumes: `useContent`, `skills`, `education`, `Section`, `Reveal`
- Produces: `<Stack />`, default export, rendering `id="stack"`

- [ ] **Step 1: Create the section**

No logo chips, no proficiency bars, no language bars — closing D3.

```jsx
import Section from '../components/Section'
import Reveal from '../components/Reveal'
import { useContent } from '../lib/useContent'
import { skills as localSkills, education as localEducation } from '../content'

const Stack = () => {
  const skills = useContent('skills', localSkills)
  const education = useContent('education', localEducation)

  const certs = education.filter(e => e.type === 'certification')
  const study = education.filter(e => e.type === 'education')

  return (
    <Section id="stack" ground="light" className="border-t border-rule">
      <Reveal>
        <h2 className="display text-[clamp(2.25rem,6vw,4.5rem)]">Stack</h2>
      </Reveal>

      <div className="mt-14 space-y-8">
        {skills.map((group, i) => (
          <Reveal key={group.id} delay={i * 60}>
            <div className="grid gap-3 border-t border-rule pt-5 md:grid-cols-[220px_1fr] md:gap-8">
              <p className="meta">{group.group}</p>
              <p className="text-[16px] text-ink-2">{group.items.join('  ·  ')}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-24 grid gap-16 lg:grid-cols-2">
        <Reveal>
          <h3 className="display text-[30px]">Education</h3>
          <ul className="mt-6 space-y-6">
            {study.map(item => (
              <li key={item.id} className="border-t border-rule pt-4">
                <p className="text-[16px] text-ink">{item.title}</p>
                <p className="meta mt-1">{item.subtitle} · {item.period}</p>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={80}>
          <h3 className="display text-[30px]">Certifications</h3>
          <ul className="mt-6 space-y-6">
            {certs.map(item => (
              <li key={item.id} className="border-t border-rule pt-4">
                <p className="text-[16px] text-ink">
                  {item.verify_url ? (
                    <a href={item.verify_url} target="_blank" rel="noreferrer"
                       className="border-b border-rule pb-0.5 hover:border-ink">
                      {item.title}
                    </a>
                  ) : item.title}
                </p>
                <p className="meta mt-1">{item.subtitle} · {item.period}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  )
}

export default Stack
```

- [ ] **Step 2: Remove the old file and verify**

```bash
git rm -q src/Skills.jsx
grep -riE "lang-bar|skill-chip|simpleicons" src/ || echo "CLEAN — no bars or logo chips"
```

Expected: `CLEAN`.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: rebuild stack and credentials as a typographic index

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 12: Contact

**Files:**
- Create: `src/sections/Contact.jsx`
- Delete: `src/Contact.jsx`

**Interfaces:**
- Consumes: `supabase`, `profile`, `Section`, `Reveal`
- Produces: `<Contact />`, default export, rendering `id="contact"` on a dark ground. Inserts into `contact_messages` with `{ name, email, subject: null, message, company: null, budget: null }` so the existing admin Messages tab keeps working.

- [ ] **Step 1: Create the section**

Company and Budget are removed, closing D8. Status is announced via `aria-live`.

```jsx
import { useState } from 'react'
import Section from '../components/Section'
import Reveal from '../components/Reveal'
import { supabase } from '../lib/supabase'
import { profile } from '../content'

const FIELD =
  'w-full border border-noir-rule bg-noir-2 px-4 py-3 text-[16px] text-noir-ink placeholder:text-noir-ink-3'

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle')

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const { error } = await supabase.from('contact_messages').insert({
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
        company: null,
        budget: null,
        subject: null,
      })
      if (error) throw error
      setStatus('sent')
      setForm({ name: '', email: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <Section id="contact" ground="dark">
      <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <h2 className="display text-[clamp(2.25rem,6vw,4.5rem)] text-noir-ink">
            Get in touch
          </h2>
          <p className="measure mt-6 text-[17px] text-noir-ink-2">
            Open to conversations about front-end and full-stack work,
            especially in enterprise contexts. I read everything that comes in.
          </p>

          <ul className="mt-10 space-y-3">
            {[
              ['Email', `mailto:${profile.email}`, profile.email],
              ['LinkedIn', profile.linkedin, 'in/filip-galach'],
              ['GitHub', profile.github, 'FIFI1803'],
              ['CV', profile.cv, 'Download PDF'],
            ].map(([label, href, text]) => (
              <li key={label} className="grid grid-cols-[110px_1fr] gap-4">
                <span className="meta text-noir-ink-3">{label}</span>
                <a href={href} className="border-b border-noir-rule pb-0.5 text-[16px] text-noir-ink hover:border-noir-ink">
                  {text}
                </a>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={100}>
          <form onSubmit={submit} className="space-y-5">
            <div>
              <label htmlFor="name" className="meta text-noir-ink-3">Name</label>
              <input id="name" required value={form.name} onChange={set('name')}
                     className={`${FIELD} mt-2`} />
            </div>
            <div>
              <label htmlFor="email" className="meta text-noir-ink-3">Email</label>
              <input id="email" type="email" required value={form.email} onChange={set('email')}
                     className={`${FIELD} mt-2`} />
            </div>
            <div>
              <label htmlFor="message" className="meta text-noir-ink-3">Message</label>
              <textarea id="message" required rows={6} value={form.message} onChange={set('message')}
                        className={`${FIELD} mt-2 resize-y`} />
            </div>

            <button type="submit" disabled={status === 'sending'}
                    className="bg-noir-ink px-6 py-3 text-[15px] text-noir transition-opacity hover:opacity-85 disabled:opacity-50">
              {status === 'sending' ? 'Sending…' : 'Send message'}
            </button>

            <p aria-live="polite" className="meta">
              {status === 'sent' && 'Thanks — I’ll come back to you.'}
              {status === 'error' && `Something went wrong. Email me directly at ${profile.email}.`}
            </p>
          </form>
        </Reveal>
      </div>
    </Section>
  )
}

export default Contact
```

- [ ] **Step 2: Remove the old file and verify**

```bash
git rm -q src/Contact.jsx
grep -riE "budget|company" src/sections/Contact.jsx | grep -v "company: null" \
  || echo "CLEAN — budget and company fields removed"
```

Expected: `CLEAN`.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: rebuild contact, drop company and budget fields

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 13: Assemble the app

**Files:**
- Rewrite: `src/App.jsx`
- Create: `src/components/Footer.jsx`

**Interfaces:**
- Consumes: every section from Tasks 6–12
- Produces: the composed page. Section order and grounds must match spec §3.2.

- [ ] **Step 1: Create the footer**

```jsx
import { profile } from '../content'

const Footer = () => (
  <footer className="on-noir border-t border-noir-rule bg-noir">
    <div className="mx-auto flex max-w-[1240px] flex-col gap-3 px-6 py-10 md:flex-row md:items-center md:justify-between md:px-10 lg:px-14">
      <p className="meta text-noir-ink-3">
        © {new Date().getFullYear()} {profile.name} · {profile.location}
      </p>
      <p className="meta text-noir-ink-3">Built with React, Tailwind and Vite</p>
    </div>
  </footer>
)

export default Footer
```

- [ ] **Step 2: Rewrite App.jsx**

```jsx
import Navigation from './Navigation'
import Hero from './sections/Hero'
import Work from './sections/Work'
import Sap from './sections/Sap'
import About from './sections/About'
import Stack from './sections/Stack'
import Contact from './sections/Contact'
import Footer from './components/Footer'

const App = () => (
  <div className="min-h-screen bg-paper">
    <Navigation />
    <main>
      <Hero />
      <Work />
      <Sap />
      <About />
      <Stack />
      <Contact />
    </main>
    <Footer />
  </div>
)

export default App
```

- [ ] **Step 3: Verify build, lint, tests and bundle budget**

```bash
npm run lint && npm test && npm run build
```

Expected: 0 lint errors, 8 tests pass, build succeeds. Read the gzip figure for the **main** chunk — it must be ≤ 160 kB, and a **separate** admin chunk must be listed.

- [ ] **Step 4: Uninstall GSAP**

Every consumer has now been replaced, so the dependency can go.

```bash
grep -ril gsap src/ || echo "no gsap imports remain"
npm uninstall gsap @gsap/react
npm run build
```

Expected: no imports remain, uninstall succeeds, build still passes.

- [ ] **Step 5: Confirm GSAP is gone and re-check the budget**

```bash
grep -c gsap package.json || echo "CLEAN — gsap removed"
```

Expected: `CLEAN`. Re-read the main chunk's gzip size — it should have dropped
roughly 25 kB versus Step 3.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: assemble redesigned page with light-dark section rhythm

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 14: Verification suite

Implements spec §9. These are the acceptance tests for the whole redesign.

**Files:**
- Create: `e2e/portfolio.spec.js`, `playwright.config.js`
- Modify: `package.json`

**Interfaces:**
- Consumes: the built site served by `vite preview`
- Produces: `npm run e2e`

- [ ] **Step 1: Install Playwright**

```bash
npm i -D @playwright/test
npx playwright install chromium
```

Create `playwright.config.js`:

```js
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  use: { baseURL: 'http://localhost:4173' },
  webServer: {
    command: 'npm run build && npx vite preview --port 4173',
    port: 4173,
    reuseExistingServer: false,
    timeout: 120000,
  },
})
```

Add to `package.json` scripts: `"e2e": "playwright test"`.

- [ ] **Step 2: Write the acceptance tests**

Create `e2e/portfolio.spec.js`:

```js
import { test, expect } from '@playwright/test'

const SECTIONS = ['work', 'sap', 'about', 'stack', 'contact']

test('renders every section with content when Supabase is unreachable', async ({ page }) => {
  // The exact condition that produced the empty labelled voids (F2).
  await page.route('**/*.supabase.co/**', route => route.abort())
  await page.goto('/')
  await page.waitForTimeout(3000)

  for (const id of SECTIONS) {
    const section = page.locator(`#${id}`)
    await expect(section).toBeVisible()
    const text = await section.innerText()
    expect(text.trim().length, `#${id} rendered empty`).toBeGreaterThan(120)
  }

  await expect(page.getByText('Variable Management', { exact: false })).toBeVisible()
  await expect(page.getByText('FOREVER', { exact: false })).toBeVisible()
})

test('reveals all content even if IntersectionObserver never fires', async ({ page }) => {
  await page.addInitScript(() => {
    window.IntersectionObserver = class {
      constructor() {}
      observe() {}
      disconnect() {}
      unobserve() {}
    }
  })
  await page.goto('/')
  await page.waitForTimeout(3200)
  const hidden = await page.locator('[data-reveal="out"]').count()
  expect(hidden, 'content still hidden after the fallback timer').toBe(0)
})

test('serves a real PDF at the CV link', async ({ request }) => {
  const res = await request.get('/filip-galach-cv.pdf')
  expect(res.status()).toBe(200)
  expect(res.headers()['content-type']).toContain('pdf')
})

test('has no horizontal overflow at any breakpoint', async ({ page }) => {
  for (const width of [390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')
    await page.waitForTimeout(500)
    const overflow = await page.evaluate(() =>
      document.documentElement.scrollWidth - document.documentElement.clientWidth)
    expect(overflow, `horizontal overflow at ${width}px`).toBeLessThanOrEqual(1)
    await page.screenshot({ path: `e2e/shots/${width}.png`, fullPage: true })
  }
})

test('keeps total image weight under 500 kB', async ({ page }) => {
  let bytes = 0
  page.on('response', async res => {
    if (!/image/.test(res.headers()['content-type'] || '')) return
    const body = await res.body().catch(() => null)
    if (body) bytes += body.length
  })
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  expect(bytes / 1024).toBeLessThan(500)
})

test('exposes an accessible mobile menu', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  const toggle = page.getByRole('button', { name: /menu/i })
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await toggle.click()
  await expect(toggle).toHaveAttribute('aria-expanded', 'true')
  await page.keyboard.press('Escape')
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await expect(toggle).toBeFocused()
})

test('has exactly one h1', async ({ page }) => {
  await page.goto('/')
  expect(await page.locator('h1').count()).toBe(1)
})
```

- [ ] **Step 3: Run the suite**

```bash
mkdir -p e2e/shots
echo "e2e/shots/" >> .gitignore
npm run e2e
```

Expected: **7 passed**. Any failure is a real defect — fix it rather than relaxing the assertion.

- [ ] **Step 4: Review the screenshots by eye**

Open `e2e/shots/390.png`, `768.png` and `1440.png`. Check: the light-to-dark rhythm reads clearly, display type is not cramped at 390 px, and the Work section is visibly the most substantial part of the page.

- [ ] **Step 5: Final full verification**

```bash
npm run lint && npm test && npm run build && npm run e2e
```

Expected: 0 lint errors, 8 unit tests pass, build succeeds under budget, 7 e2e tests pass.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "test: add acceptance suite covering spec section 9

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Spec coverage

| Spec item | Task |
|-----------|------|
| F1 CV link | 2, 6 |
| F2 empty sections | 4, 14 |
| F3 stale triggers | 1 (GSAP removed), 5 (Reveal), 14 |
| F4 admin in bundle | 1, 13 |
| F5 image weight | 2, 14 |
| F6 lint errors | 1 |
| F7 favicon + meta | 2 |
| F8 dead code | 1 |
| D1 template patterns | 3, 7 |
| D2 abstract copy | 4, 7 |
| D3 vanity stats and bars | 10, 11 |
| D4 two portraits | 7, 10 |
| D5 buried wins | 9 |
| D6 uniform rhythm | 5, 13 |
| D7 weak projects section | 8 |
| D8 contact fields | 12 |
| §3.1 no accent colour | 3 |
| §3.2 light/dark rhythm | 5, 13 |
| §3.3 typography | 3 |
| §3.4 palette | 3 |
| §3.5 motion guarantees | 5, 14 |
| §4 information architecture | 7–13 |
| §5 content resilience | 4 |
| §6 component structure | 5, 8, 13 |
| §7 engineering | 1, 2 |
| §8 accessibility | 3, 6, 12, 14 |
| §9 verification | 14 |

## Notes for the executor

- **Never relax an assertion to make a test pass.** Each one encodes an audit finding that reached production.
- Projects in `src/content/projects.js` have `image_url: null` because no screenshots were found on disk and the Supabase project is paused. The typographic fallback in Task 8 is a designed state, not a placeholder — it should look finished.
- Do not restore GSAP. The motion in this design needs nothing beyond CSS transitions, and ScrollTrigger is the direct cause of F3.
- `Admin.jsx` keeps reading the same Supabase tables. Do not change its column names, or the local content shapes in Task 4, without changing both.
