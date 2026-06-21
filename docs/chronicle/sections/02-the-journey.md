# Section 02 — The Journey (Experience)

**Component:** `src/components/Experience.jsx` · **id:** `work` · **Status:**
rebuild (delete the `react-vertical-timeline-component` version entirely).

## Purpose
His career as a **traveled path**, not a résumé list. A horizontally-scrolling
journey the visitor *scrubs through* — each role/milestone a waypoint along a
glowing cartographer's route. Cinematic, kinetic, memorable.

## The mechanic — pinned horizontal scrub (signature motion)
- The section **pins** to the viewport and converts vertical scroll into
  **horizontal travel** along the route (GSAP ScrollTrigger pin + `scrub`).
- A continuous **route line** (`--gradient-map-line`) runs left→right; it
  **draws in** as you progress (`strokeDashoffset`/scaleX tied to scroll
  progress). **Waypoint nodes** (ember/gold diamonds) sit along it; the active
  one pulses as it reaches center.
- Each waypoint reveals a **compact milestone card** (see below) as it enters.
- A thin **progress indicator** (e.g. "02 ▸ 2022—Present") shows position.

### Implementation pattern
```jsx
const root = useRef(null), track = useRef(null);
useEffect(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ctx = gsap.context(() => {
    if (reduce) return;                       // fallback: vertical stacked cards
    const track = … ; const dist = track.scrollWidth - window.innerWidth;
    gsap.to(track, {
      x: -dist, ease: 'none',
      scrollTrigger: {
        trigger: root.current, start: 'top top',
        end: () => `+=${dist}`, pin: true, scrub: 1, invalidateOnRefresh: true,
      },
    });
    // draw route + activate waypoints off the same progress
  }, root);
  return () => ctx.revert();
}, []);
```
- Recompute on resize (`invalidateOnRefresh`, `ScrollTrigger.refresh()` on font/img load).
- `end: +=dist` so pin length matches content width (no dead scroll).

## Milestone card (compact, NOT bloated)
Per role show only: **company + role** (serif), **dates**, a **one-line impact
headline**, and **2–3 short bullets max** (pick the strongest from the résumé —
not all of them), plus 3–4 tech "runes". Think trading-card, not document. Each
card ~`360–420px` wide, `realm-card` styled, with a waypoint marker above it.

Add hover depth (tilt/glow) and a small "expand" affordance only if a role truly
needs more (keep default collapsed/short).

## Content (from `constants.experiences`)
Use `title`, `company_name`, `date`, `technologies`, and a **trimmed** `points`
(curate 2–3). Consider adding a `headline` field per experience in constants
(one punchy line) for the card's lead. Keep résumé-accurate.

## Responsive / fallback
- **Mobile & reduced-motion:** no pin/horizontal; render a clean **vertical
  stacked** sequence of the same cards along a vertical route line, revealing on
  scroll. Same data, same components — only layout/motion differ.
- Test that pinning releases cleanly into the next section (no overlap/jump).

## Accessibility / performance
- Section is keyboard-reachable; cards are readable without hover.
- Honor reduced-motion (vertical fallback). Animate transform only.
- Don't trap scroll — horizontal scrub must end and continue vertically.

## Acceptance criteria
- [ ] Vertical timeline component fully removed.
- [ ] Scrolling pins + travels horizontally with a drawing route + active waypoints.
- [ ] Cards are compact (≤3 bullets), curated, on-theme, never text-walls.
- [ ] Mobile/reduced-motion vertical fallback works; pin releases cleanly.
- [ ] 60fps; resize-safe; no scroll lock; dark+light correct.
