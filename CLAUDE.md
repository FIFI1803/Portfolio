# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (Vite HMR)
npm run build     # Production build
npm run preview   # Preview production build locally
npm run lint      # Run ESLint
```

No test suite is configured.

## Architecture

Single-page portfolio site built with React 19 + Vite + Tailwind CSS v4 + GSAP.

**Structure:** `src/App.jsx` composes all sections in order — `Navigation`, `Hero`, `About`, `Skills`, `Experience`, `Projects`, `Contact`. No routing; navigation uses anchor links (`#home`, `#about`, etc.).

**Animations:** GSAP with ScrollTrigger is registered once at the top of `App.jsx`. Each section component manages its own GSAP animations in `useEffect` using `gsap.context()` scoped to a `ref`, and reverts on cleanup. Hero also attaches a passive scroll listener for parallax fade.

**Styling:** Tailwind CSS v4 imported via `@tailwindcss/vite` plugin (not PostCSS). Global CSS is minimal — just the Mona Sans font import and `@import "tailwindcss"`. Dark theme using `bg-gray-950` as the base. Glassmorphism pattern (`backdrop-blur-md bg-white/5 border border-white/10`) used for the navbar.

**Static assets:** Images (e.g. `/HeroImage.png`) are served from the `public/` directory.
