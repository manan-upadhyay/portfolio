# Section 01 — The Craft (About)

**Component:** `src/sections/About.jsx` · **id:** `about` · **Status:** built.

## Purpose
Establish *who* he is and *how he works* — fast, cinematic, scannable. This is
character intro, not a biography. A few punchy, revealed-on-scroll beats; no wall
of text (the résumé exists for detail).

## Narrative
"Chapter 01 · The Craft / Origin." A short literary intro line (ember italic),
then his working principles as a tight set, then four **Disciplines**. Subtle
cartographer framing ("every realm began as an empty repo and a blinking cursor").

## Layout
- `ChapterHeading no="01" eyebrow="The Craft" title="Origin."` (left aligned).
- **Two-column intro:** left = ember italic pull-quote + 2–3 line bio + animated
  stat counters (`stats`); right = "The Scribe's Note" card — 4 principle
  bullets (ownership, performance, security, mentorship), each one line.
- **Disciplines:** 4 cards in a responsive grid (`services`) — generous padding
  (`p-8`), `font-chronicle` titles, NO clipped text, `realm-card` styling, lucide
  or refined iconography (drop the old gem PNGs; use a consistent ember line-icon
  per discipline). Hover lifts (`y:-6`, spring).

## Motion
- Reveal beats with `ScrollReveal`/Framer `whileInView` (stagger).
- Stat counters animate up on enter (reuse a counter; do NOT add percentage bars
  — banned, junior signal).
- Optional: a faint parallax on a background map/parchment texture behind the
  intro (transform-only). Keep it subtle; copy must stay legible.

## Content (from `constants`)
`personalInfo.bio`, `stats`, `services` (4 disciplines). Principles list can live
as a small local array or be promoted to `constants` (`principles`). Keep all
copy résumé-accurate.

## Components & reuse
`ChapterHeading`, `realm-card` utility, `ScrollReveal`, a shared `StatTile` and
`DisciplineCard` (local). If `StatTile` is reused elsewhere, promote to `src/components/`.

## States / responsive
- 1-col stack on mobile (intro → note → disciplines as 1→2 cols).
- Cards equal-height; text never clipped at any width.

## Accessibility / performance
- Headings semantic; AA contrast (watch ember on parchment in light).
- Reduced-motion: counters show final value instantly; reveals become fades.

## Acceptance criteria
- [ ] No percentage/skill bars anywhere. Skills live ONLY in The Arsenal.
- [ ] Disciplines cards have breathing room, consistent icons, zero clipped text.
- [ ] Intro reads in <10s; literary but accurate; stats animate once.
- [ ] Dark + light correct; responsive at all breakpoints.
