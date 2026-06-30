# The Chronicle — Manan Upadhyay Portfolio

A cinematic, scroll-directed portfolio for **Manan Upadhyay** (Full-Stack
Developer, 5+ yrs). Not a template or a résumé dump — an interactive story told as
a cartographer's journey through *chapters*, with projects charted as *realms* on
an interactive map.

**Live:** [upadhyaymanan.in](https://upadhyaymanan.in)

## Highlights

- **Cinematic hero** — a pure-CSS starfield (no image) with a hand-built **Canvas2D
  astrolabe** that assembles on load and tracks the cursor.
- **Day / night theming** — "starlit realm" (dark) and "dawn over the realm"
  (light), all color via CSS variables, with a View-Transition radial reveal.
- **Scroll choreography** — GSAP + ScrollTrigger over Lenis smooth scroll: a pinned
  horizontal experience timeline, an orbital skill field, editorial project plates.
- **⌘K map overlay** — fuzzy-searchable navigation across chapters and links.
- **Server-side contact** — the "Summon" form posts to a **Resend**-backed endpoint;
  the API key never reaches the client.
- **Accessible & resilient** — honors `prefers-reduced-motion` and coarse pointers;
  every section is lazy-loaded behind an `ErrorBoundary`.

## Tech stack

React 18 · Vite 4 · Tailwind (layout) + CSS variables (theme) · Framer Motion ·
GSAP/ScrollTrigger · Lenis · Zustand · lucide-react · Resend · Vercel Analytics.
**No WebGL/Three.js.** Node 24 (pinned via `engines` + `.nvmrc`).

## Project structure

```
src/
  sections/     Hero, About, Experience, Tech, Works, Contact (the chapters)
  components/   reusable widgets (SideRail, MapOverlay, Cursor, CompassRose, …)
  hoc/ hooks/ lib/ store/ constants/ assets/   index.css (theme tokens)
api/            Resend serverless function + shared sender lib
public/         production assets only (favicons, og-image, logos, realms/…)
branding/       brand source/archive — NOT deployed
tools/          og-image generation template
docs/chronicle/ source-of-truth design system, architecture & section specs
```

> Read [`CLAUDE.md`](./CLAUDE.md) first, then [`docs/chronicle/`](./docs/chronicle/).
> A full code/architecture audit lives in [`docs/AUDIT.md`](./docs/AUDIT.md).

## Commands

```bash
npm run dev      # vite dev server (contact form works via dev middleware)
npm run build    # production build (must stay clean)
npm run preview  # preview the production build
npm run lint     # eslint (must stay green)
```

## Contact form (Resend) setup

The "Summon" form needs server-side env vars (never exposed to the browser — no
`VITE_` prefix). Copy `.env.example` → `.env` and set:

```
RESEND_API_KEY=...                 # https://resend.com/api-keys
RESEND_TO="you@example.com"        # inbox that receives submissions
RESEND_FROM="Name <hi@domain.com>" # verified sender (onboarding@resend.dev for tests)
```

Locally, `npm run dev` serves `POST /api/send-raven` via a Vite middleware that
runs the same handler Vercel uses in production.

<!-- Trigger deployment - 30 June 2026 11:13 AM -->
