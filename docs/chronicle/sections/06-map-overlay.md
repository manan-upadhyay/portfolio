# Section 06 — The Map (interactive overlay)

**Component:** new `src/components/ui/MapOverlay.jsx` (replaces the list-style
`CommandPalette` UI) · **Trigger:** ⌘K / Navbar "Map" button · **Status:** build.

## Purpose
The site's navigation reimagined as the Chronicle's **map** — not a dropdown
list. Opening it should feel like unfurling a cartographer's map with glowing
**location pins**, one per chapter. Keep the command-palette power (keyboard,
search, quick actions) underneath the cinematic surface.

## Behavior
- Opens on **⌘K** (or Navbar Map). Closes on `Esc`, backdrop click, or selecting
  a destination. Full-screen overlay with blurred dim backdrop.
- **Unfurl animation:** the map panel scales/clip-reveals open (Framer/GSAP),
  pins drop in with a stagger, the route line draws between them.
- **Pins = chapters** (`origin, about, work, arsenal, projects, contact`),
  positioned over `map/realm-map.webp`. Each pin: glowing ember `MapPin`, label,
  chapter number. **Hover** → pin lifts + label card + the route highlights to
  it. **Click/Enter** → close overlay + `scrollToSection(id)`.
- **Keyboard:** arrow/Tab to move focus between pins (in chapter order), Enter to
  travel; `/` or typing focuses a search field that filters pins + quick actions.
- **Quick actions** (below or as special pins): Resume, GitHub, LinkedIn, Toggle
  Day/Night. Reuse the current command list/actions.

## Layout
- Centered panel (`max-w-4xl`), parchment/vellum background = `realm-map.webp`
  (themed: aged parchment light / ink-blue vellum dark; CSS fallback gradient +
  grid if absent). Pins absolutely positioned via a small coords table:
```js
const PINS = [
  { id:'origin',  label:'Origin',    no:'00', x:18, y:70 },
  { id:'about',   label:'The Craft', no:'01', x:34, y:42 },
  { id:'work',    label:'The Journey', no:'02', x:52, y:64 },
  { id:'arsenal', label:'The Arsenal', no:'03', x:66, y:34 },
  { id:'projects',label:'The Realms', no:'04', x:80, y:58 },
  { id:'contact', label:'Summon',    no:'05', x:90, y:30 },
]; // x/y as % of the map; tune to the art
```
- A compass rose + "you are here" indicator reflecting the current scroll section
  (track active section via ScrollTrigger/IO and highlight its pin).

## Migration from CommandPalette
- Keep `CommandPalette`'s keydown (⌘K/Esc), search filtering, and action list;
  re-skin the **presentation** into the map. The `App.openMap` handler can stay
  (dispatch ⌘K) or call an exposed open method. Keep it a single source for
  navigation actions so canon stays in sync.

## Accessibility / performance
- `role="dialog" aria-modal="true"`, focus-trap, return focus on close, `Esc`.
- Pins are real `<button>`s with `aria-label`; search input labeled.
- Reduced-motion: instant open, no draw animation. Map image lazy-loaded.

## Acceptance criteria
- [ ] ⌘K and Map button open a real map overlay (not a list).
- [ ] Six chapter pins navigate via `scrollToSection`; active section highlighted.
- [ ] Searchable; quick actions (resume/theme/social) present; keyboard complete.
- [ ] Focus-trapped, `Esc`/backdrop close, reduced-motion safe; dark+light themed.
