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

## Sections (all built; this set is the spec of record)
| Order | Spec | Component | Status |
|---|---|---|---|
| 00 | [Origin / Hero](sections/00-hero.md) | `sections/Hero.jsx` | built (procedural starfield + astrolabe) |
| 01 | [The Craft](sections/01-the-craft.md) | `sections/About.jsx` | built |
| 02 | [The Journey](sections/02-the-journey.md) | `sections/Experience.jsx` | built (pinned horizontal) |
| 03 | [The Arsenal](sections/03-the-arsenal.md) | `sections/Tech.jsx` | built (orbital field) |
| 04 | [The Realms](sections/04-the-realms.md) | `sections/Works.jsx` | built (editorial plates) |
| 05 | [Summon](sections/05-summon.md) | `sections/Contact.jsx` | built (Resend contact) |
| 06 | [The Map](sections/06-map-overlay.md) | `components/MapOverlay.jsx` | built (⌘K map) |

Each section spec ends with **Acceptance criteria** — a section is done only when
all boxes pass in dark+light, at 360/768/1280/1920, with reduced-motion + touch
fallbacks, no console errors, and a clean `npm run build`.
