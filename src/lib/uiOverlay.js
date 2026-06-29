// A tiny global "is a UI surface in front?" signal.
//
// The hero astrolabe tracks the cursor (and its needle drives the gear sound)
// from a global pointer listener — so when a menu or modal opens OVER the hero,
// moving the cursor inside that surface would still swing the needle and keep the
// gear humming, even though the instrument is blurred behind and no longer the
// focus. Overlays raise this flag while open; the astrolabe reads it each frame
// and goes dormant (frozen needle, silent gear) until they close.
//
// A counter (not a boolean) so nested/stacked surfaces — e.g. the Voice Hall
// summoned from the ⌘K map — release correctly: dormant until the LAST one closes.

let openCount = 0;

/** Is any registered overlay/menu currently open in front of the page? */
export const isOverlayOpen = () => openCount > 0;

/** Register an overlay as open. Pair every call with exactly one `popOverlay`. */
export const pushOverlay = () => { openCount += 1; };

/** Release a previously-registered overlay. Clamped so it can't go negative. */
export const popOverlay = () => { openCount = Math.max(0, openCount - 1); };
