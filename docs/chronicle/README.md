# docs/chronicle — Source of Truth

The canonical specification set for **The Chronicle** portfolio revamp. Start at
the repo-root [`CLAUDE.md`](../../CLAUDE.md), then read here. These supersede the
older `docs/*.md` (pre-revamp template).

## Read order
1. [`CLAUDE.md`](../../CLAUDE.md) — vision, canon, standards, workflow.
2. [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md) — tokens, type, motion language, utilities.
3. [ARCHITECTURE.md](ARCHITECTURE.md) — stack, patterns, shell, perf, verification.
4. [ASSETS.md](ASSETS.md) — world bible + generation prompts.
5. `sections/` — per-section specs (build order below).

## Sections & build order
| Order | Spec | Component | Status |
|---|---|---|---|
| 00 | [Origin / Hero](sections/00-hero.md) | `Hero.jsx` | built, polishing |
| 01 | [The Craft](sections/01-the-craft.md) | `About.jsx` | rebuild |
| 02 | [The Journey](sections/02-the-journey.md) | `Experience.jsx` | rebuild (pinned horizontal) |
| 03 | [The Arsenal](sections/03-the-arsenal.md) | `Tech.jsx` | rebuild (orbital field) |
| 04 | [The Realms](sections/04-the-realms.md) | `Works.jsx` | rebuild (editorial plates) |
| 05 | [Summon](sections/05-summon.md) | `Contact.jsx` | rebuild + drop Three.js |
| 06 | [The Map](sections/06-map-overlay.md) | `ui/MapOverlay.jsx` | build (replace list palette) |

Each section spec ends with **Acceptance criteria** — a section is done only when
all boxes pass in dark+light, at 360/768/1280/1920, with reduced-motion + touch
fallbacks, no console errors, and a clean `npm run build`.
