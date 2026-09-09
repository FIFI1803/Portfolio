# Portfolio Redesign — Design Spec

**Date:** 2026-09-09
**Repo:** `~/Desktop/Projects/Portfolio` · deployed at `filipgalach.dev`
**Status:** Approved for planning

---

## 1. Purpose

The site's job is to answer one question: **someone found Filip on social, searched his name, and wants to know whether he's legitimate.**

That framing decides everything downstream:

- The work is the proof, so the work gets the most space.
- Personality has to come from the writing and the typography, because there is no published long-form content or embeddable social feed yet.
- CV-scannability matters, but it is secondary to conviction.

Non-goals: freelance client acquisition, a content hub, a blog.

---

## 2. Audit findings this redesign must resolve

Recorded from the audit of `main` @ `03fcec9` plus the uncommitted working tree.

### Functional defects

| # | Finding | Evidence |
|---|---------|----------|
| F1 | Download CV links to a file that does not exist | `Navigation.jsx:78` → `/Filip_Galach_Resume.pdf`; `public/` contains no PDF. `vercel.json` rewrites all paths to the SPA, so it silently serves `index.html` as a "PDF" rather than 404ing. |
| F2 | Skills, Experience, Projects and Education render as **empty labelled voids** when Supabase is unreachable | Supabase project `filip-portfolio` (`lvwynwjopxyvtoymnqnw`) reports `INACTIVE`; MCP query timed out. No loading, skeleton, error or empty state exists in any of the three components. Confirmed by screenshot. |
| F3 | No `ScrollTrigger.refresh()` after async data lands | `About` and `Contact` register triggers on mount; `Skills`/`Experience`/`Projects` then inject content and grow the page by thousands of px, invalidating those start positions. Because everything animates via `gsap.from({opacity: 0})`, a trigger that never fires leaves content **permanently invisible**. |
| F4 | Every public visitor downloads the 753-line admin panel | `main.jsx:6` statically imports `admin/Admin.jsx`; single bundle is 576 kB / 179 kB gzip. |
| F5 | 4.5 MB of unoptimised images | `public/JPEG image.png` is 3600×2400, 3.6 MB, rendered at 380 px wide **and** greyscaled. No responsive sources, no intrinsic dimensions, no lazy-loading, no modern format. |
| F6 | 5 ESLint errors | All `admin/Admin.jsx`, `react-hooks/set-state-in-effect`. |
| F7 | Favicon references a non-existent file | `index.html` → `/vite.svg`, absent from `public/`. No OG/Twitter meta tags. |
| F8 | Dead code in working tree | `Cursor.jsx` and `Marquee.jsx` no longer imported by `App.jsx`; change is uncommitted. |

### Design defects

| # | Finding |
|---|---------|
| D1 | The page is a checklist of the 2025 dev-portfolio template: pulsing green availability dot, mono uppercase eyebrows at `0.14em`, numbered section labels (`01 / About`), giant tight-tracked two-line name, 72 px grid overlay, "Scroll to explore" hairline, ↗↘ glyphs, glassmorphic sticky nav. Each is defensible alone; together they *are* the template. |
| D2 | Copy is abstract and unfalsifiable — *"Building thoughtful enterprise products and modern web experiences with clarity, reliability, and purpose."* Three abstract nouns, zero claims. |
| D3 | Vanity metrics: `3+ years / 5+ projects / 2 languages spoken`. Animated count-ups draw the eye to how small the numbers are. Language bars render English 100% and Polish 100% — two identical full bars conveying nothing. |
| D4 | Two portraits of the same person, one moody and one greyscale-corporate. Redundant and tonally split. |
| D5 | The strongest material — the 79-case UAT plan, the Variable Management system that replaced rigid static filters — is buried mid-paragraph in three dense blocks of CV prose. |
| D6 | Uniform rhythm: all six sections are `min-h-screen` + `py-32`, producing a ~6000 px page where nothing is emphasised because everything is. |
| D7 | Projects — the section that does the actual persuading — is the weakest: generic 2-up cards with "Screenshot coming soon" placeholders and no case depth. |
| D8 | Contact form collects Company and Budget. Wrong funnel for an employed apprentice seeking opportunities. |

### Context: the palette regression

`HEAD` carries the brand from `brandguidelines.html` — Ember `#FF5C2B`, Syne, DM Sans, obsidian `#0D0D0F`, introduced by `f23e367` "Redesign following brand guidelines". The working tree replaced that entire token block with periwinkle `#8BA8FF` and Archivo **without committing**, leaving token names that lie (`--color-ember` holds a blue; `--color-sage` and `--color-gold` are the same blue; `--font-syne` and `--font-dm` both resolve to Archivo).

Filip has elected to retire the Ember/"Build Different" identity rather than restore it. This spec defines its replacement. `brandguidelines.html` becomes historical and should be moved to `docs/` rather than deleted.

---

## 3. Design direction

**Light, warm, monochrome — with colour supplied only by the work.**

### 3.1 The central decision: no accent colour

Every developer portfolio picks an accent, and picking one is a large part of why they resemble each other. This site has none. The canvas is warm off-white, the ink is near-black, and **the only colour on the page arrives inside Filip's project screenshots.** That makes the work the brightest thing on the site, which is the correct hierarchy for a page whose purpose is proving he builds things. It is also the actual Apple and OpenAI register: the product supplies the colour, the chrome stays quiet.

### 3.2 Rhythm: light punctuated by dark

The page alternates ground rather than running one tone throughout:

```
Hero              light
Work              DARK   ← full-bleed inversion, the spine
At SAP            light
About             light
Stack             light
Contact           DARK   ← full-bleed inversion, the close
```

Two inversions give the page structure and make the Work section feel like a distinct place rather than the fifth of six identical blocks. It also solves D6 without relying on decorative dividers.

### 3.3 Typography

| Role | Face | Usage |
|------|------|-------|
| Display | **Instrument Serif** 400 + italic | Hero statement, section openers, pull quotes. Large only — never below 28 px. |
| UI / body | **Inter Tight** 400 / 500 / 600 | Paragraphs, navigation, buttons, project copy. |
| Metadata | **JetBrains Mono** 400 / 500 | Dates, indices, stack lists, labels, form hints. |

Serif-plus-mono is a pairing no dev-portfolio template uses; it reads as considered rather than generated. Instrument Serif carries the personality, so the grotesk can stay neutral and the mono can stay strictly functional.

This retires the mono-uppercase-eyebrow tic (D1) by giving labels a real job — metadata — rather than decoration. Section numbering (`01 /`, `02 /`) is removed entirely.

**Scale.** Display clamps from 40 px to 108 px. Body sits at 17 px with a 1.65 line-height — a deliberate increase from today's 15 px, since a light ground tolerates and rewards larger text. Measure caps at ~68 characters.

### 3.4 Palette

Monochrome, warm-biased. All values verified against WCAG.

**Light ground**

| Token | Value | Role | Contrast on `--paper` |
|-------|-------|------|----------------------|
| `--paper` | `#F8F7F4` | Primary canvas | — |
| `--paper-2` | `#F1EFEA` | Alternate band, inputs | — |
| `--ink` | `#12120F` | Headings, primary text | **17.52:1** |
| `--ink-2` | `#4A4945` | Body text | **8.41:1** |
| `--ink-3` | `#6E6C65` | Metadata, labels | **4.91:1** |
| `--rule` | `#DEDBD3` | Hairlines | 1.29:1 (decorative) |

**Dark ground**

| Token | Value | Role | Contrast on `--noir` |
|-------|-------|------|---------------------|
| `--noir` | `#0C0C0A` | Inverted canvas | — |
| `--noir-2` | `#171714` | Raised surface | — |
| `--noir-ink` | `#F5F4F0` | Headings on dark | **17.79:1** |
| `--noir-ink-2` | `#A5A39B` | Body on dark | **7.75:1** |
| `--noir-ink-3` | `#7C7A73` | Metadata on dark | **4.56:1** |
| `--noir-rule` | `#2A2A26` | Hairlines on dark | 1.36:1 (decorative) |

Every text token clears AA (4.5:1). Interaction states are expressed through underline, weight and opacity rather than hue. Focus rings are `--ink` on light and `--paper` on dark, 2 px, with a 2 px offset.

Token names describe what they are, so the failure mode from §2 (names that lie about their values) cannot recur.

### 3.5 Motion

Restrained and scroll-driven: opacity, ≤24 px offsets, and slight image scale on reveal. Removed entirely: the text-scramble effect, the custom cursor, the tech marquee, the count-up stat animation, and the animated language bars.

**One rule governs all of it: content renders visible by default and animation only enhances.** Implemented as `gsap.fromTo()` with an explicit visible end state, or CSS classes toggled by ScrollTrigger — never bare `gsap.from({opacity: 0})`, which is what makes F3 catastrophic instead of cosmetic. If JavaScript fails, GSAP fails to load, or a trigger misfires, the page is still fully readable.

`prefers-reduced-motion` disables transforms and reveals while leaving all content visible.

---

## 4. Information architecture

### 4.1 Hero — light

One specific, falsifiable claim in Instrument Serif, replacing D2. A mono metadata line carries role, employer, location. Primary action is *See the work*; secondary is the CV.

Removed: availability dot, "Scroll to explore", arrow glyphs, the two-line name treatment.

The hero portrait is retained but reframed — one portrait only (resolving D4), sized and cropped deliberately rather than faded behind a gradient stack.

Draft copy, from verified CV facts:

> I build the internal tools that SAP runs on.
>
> `Software Developer · SAP Software Asset Management · Dublin · since Dec 2024`

### 4.2 Work — **dark**, the spine

The section that answers the visitor's actual question, and therefore the one that gets the most space.

Each project is a full-width case row, not a card:

- Screenshot large and at real scale, on `--noir-2`, with a subtle hairline rather than a heavy frame
- Two-digit index in mono
- Project name in serif display
- **Problem** → **What I built** → **Outcome**, one line each
- Stack as mono metadata
- Live and repo links where they exist

Alternating image side prevents the rows from reading as a list.

**Fallback (F2):** when a project has no screenshot, the row renders as a typographic case study — index, name, the three lines, stack — which looks deliberate. There is no "Screenshot coming soon" state.

### 4.3 At SAP — light

Replaces the card-based timeline. Three specific wins written as prose-with-numbers, drawn from the CV, resolving D5 by promoting the strongest material to headline position:

1. **Variable Management, IO Analysis Report (MVP2)** — proposed and built a save/reuse custom filter system in place of the static filters originally requested.
2. **79-case UAT plan** — edge cases, role-based access (SPM vs Finance), UI validation, coordinated across stakeholders.
3. **Publisher 360 Dashboard** — currently leading front-end development of the publisher analytics view.

Supporting detail — rolling 4-period fiscal history filters, async OData with Promise handling, front-end validation before backend submission, Agile/Scrum, deployment on SAP BTP Cloud Foundry — sits underneath as mono metadata.

The SSP Duty Manager role stays, compressed to two lines. Managing a team of 10 at 20 is a genuine differentiator and should not be hidden.

### 4.4 About — light

Short, in Filip's own voice, replacing three dense CV paragraphs. Roughly four to six sentences covering: the Level 6 ICT apprenticeship (DDLETB Tallaght / FIT, Oct 2024 – Oct 2026), the pivot from Duty Manager, the Proxmox homelab, and what he's building now.

One portrait, used large and warm — not greyscale.

### 4.5 Stack & credentials — light

A single compressed, precise strip. Mono, grouped by category exactly as the CV groups them. No logo chips, no proficiency bars, no count-ups, no "languages spoken" (D3).

Certifications listed as a plain dated index: AZ-900 (Microsoft, Jan 2026), AI Fundamentals (IBM SkillsBuild, Oct 2024), Web Development Fundamentals (IBM SkillsBuild, Aug 2024), Guided Learning Experience in AI (SkillUpOnline/IBM, Jun–Dec 2024), 100 Days of Code (Udemy, Apr 2024). Verification links where they exist.

### 4.6 Contact — **dark**, the close

Name, email, message. **Company and Budget are removed** (D8).

Alongside the form: direct email, LinkedIn (`linkedin.com/in/filip-galach`), GitHub (`github.com/FIFI1803`), and the CV download.

Explicit `sending` / `sent` / `error` states — the current form has state values defined but the error path is not surfaced meaningfully.

---

## 5. Content resilience

The root cause of F2 is that remote data is the *only* source of content. The fix inverts that relationship.

- A `src/content/` module holds the canonical content for projects, experience, skills and education, compiled into the bundle and derived from the CV.
- Components render local content immediately on first paint.
- Supabase is queried in the background; when it responds with a non-empty result it **replaces** local content, and `ScrollTrigger.refresh()` is called afterwards (F3).
- When Supabase is paused, slow, or errors, the visitor sees a complete site and never learns anything was wrong.

This keeps the admin panel useful for live edits while removing the single point of failure. It also means the site survives Supabase's free-tier auto-pause, which is what caused this failure in the first place.

---

## 6. Component structure

`App.jsx` currently composes seven components with all layout inline. The redesign introduces a thin primitives layer so section files stay focused:

```
src/
  content/            index.js, projects.js, experience.js, skills.js, education.js
  components/
    Section.jsx       ground (light|dark), spacing, max-width, heading slot
    CaseRow.jsx       one Work entry — image, index, problem/build/outcome, stack
    Reveal.jsx        scroll reveal wrapper; visible by default, honours reduced-motion
    Prose.jsx         measure-capped body text
  sections/           Hero, Work, Sap, About, Stack, Contact
  lib/
    supabase.js       unchanged
    useContent.js     local-first content hook with remote override
```

`Reveal` centralises the visible-by-default rule so no section can reintroduce the `gsap.from({opacity: 0})` failure mode.

Admin moves behind `React.lazy` + `Suspense` in `main.jsx`, removing it from the public bundle (F4).

---

## 7. Engineering work

| Item | Resolves |
|------|----------|
| Copy `~/Desktop/Areas/Career/Filip Galach Resume.pdf` → `public/filip-galach-cv.pdf`; update the link | F1 |
| Local-first content layer (§5) | F2 |
| `ScrollTrigger.refresh()` after remote content replaces local | F3 |
| `React.lazy` the admin route | F4 |
| Resize and re-encode images to AVIF + WebP with JPEG fallback; add `width`/`height`, `loading="lazy"`, `decoding="async"`; rename `JPEG image.png` | F5 |
| Fix the 5 `react-hooks/set-state-in-effect` errors in `Admin.jsx` | F6 |
| Real favicon; `og:` and `twitter:` meta; accurate description | F7 |
| Delete `Cursor.jsx` and `Marquee.jsx`; move `brandguidelines.html` to `docs/` | F8 |

**Budget:** the public route currently ships a single 576 kB / **179 kB gzip** chunk that includes the admin panel. Target after splitting: **≤ 160 kB gzip**. Total image weight ≤ 500 kB, from 4.5 MB.

---

## 8. Accessibility

- All text tokens verified ≥ 4.5:1 (§3.4).
- Visible 2 px focus rings on every interactive element, tested with keyboard only.
- One `<h1>`; section headings descend in order without skipping levels.
- Mobile nav is a real disclosure — `aria-expanded`, `aria-controls`, Escape to close, focus returned to the trigger. The current implementation is a styled `<button>` with only `aria-label`.
- Form inputs use real `<label>` elements, not placeholder-only labelling. Status changes announce via `aria-live="polite"`.
- `prefers-reduced-motion` leaves all content visible.
- Images carry meaningful `alt`; decorative rules are `aria-hidden`.

---

## 9. Verification

Work is not complete until all of the following are observed, not assumed:

1. `npm run build` succeeds; `npm run lint` reports **zero** errors.
2. Public route JS ≤ 160 kB gzip, confirmed from build output; `Admin` appears in a **separate** chunk.
3. With the network blocked, every section renders complete content — this is the direct regression test for F2, and it reproduces the exact condition the audit screenshot captured.
4. `/filip-galach-cv.pdf` returns a PDF, not `index.html`.
5. Playwright screenshots at 390 / 768 / 1440 px, checked for layout defects and horizontal overflow.
6. Keyboard-only pass: every interactive element reachable with a visible focus ring.
7. Total transferred image weight ≤ 500 kB.
8. With JavaScript disabled, the page still shows readable content.

---

## 10. Open items

| Item | Owner | Blocking? |
|------|-------|-----------|
| Project screenshots — none found on disk; presumed in Supabase storage, which is paused | Filip | No — §4.2 fallback ships a complete Work section without them |
| Unpause the `filip-portfolio` Supabase project | Filip | No — §5 removes the dependency |
| Confirm which projects belong in Work. CV lists FOREVER and this portfolio; Desktop also holds Vestiary, SAP_UI5_APP, Finance Agent, boink | Filip | No — build with CV-verified entries, expand later |

None block implementation.
