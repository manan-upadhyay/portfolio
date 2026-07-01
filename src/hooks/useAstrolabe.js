import { useEffect, useRef } from 'react';
import { mountAstrolabe } from '../lib/astrolabe';

/**
 * Mounts the Canvas2D astrolabe (src/lib/astrolabe.js) onto the given refs and
 * tears it down on unmount. Re-mounts whenever `themeKey` changes so the engine
 * re-reads the CSS theme tokens.
 *
 * @param {React.RefObject<HTMLCanvasElement>} canvasRef
 * @param {React.RefObject<HTMLElement>} wrapRef    square wrapper sizing the canvas
 * @param {React.RefObject<HTMLElement>} bearingRef optional live bearing readout
 * @param {string} skyKey  theme/sky key — on change the instrument re-reads its
 *        CSS tokens in place via `refresh()` (NO remount), so an in-progress bezel
 *        sky-scrub survives a live theme change (TM-1).
 * @param {object} [opts]  callback surface (captured once per mount — pass stable
 *        store actions / module fns; closures aren't refreshed between re-mounts):
 * @param {(radPerSec: number) => void} [opts.onSpeed]  per-frame needle (or bezel)
 *        angular-speed report (rad/s) — drives the gear sound in sync.
 * @param {(skyIndex: number) => void} [opts.onDetent]  fired each time a bezel
 *        sky-scrub crosses a stop (TM-1) — the caller plays the detent cue.
 * @param {(skyIndex: number) => void} [opts.onSkyCommit]  fired when the ring comes
 *        to rest on a stop (0..3 → SKY_ORDER) — caller commits the real theme.
 * @param {(scrubPos: number) => void} [opts.onScrub]  fired every frame while a
 *        scrub is live (drag + settle) with the float stop position — caller drives
 *        the continuous sky cross-dissolve.
 * @param {string} [opts.ringLabel]  curved guidance label drawn on the ring.
 * @param {React.MutableRefObject<{ spin: () => void, setStop: (i: number) => void, setLabel: (s: string) => void } | null>} [opts.controlsRef]
 *        populated with the live instrument controls while mounted.
 */
export function useAstrolabe(canvasRef, wrapRef, bearingRef, skyKey, opts = {}) {
  const { onSpeed, onDetent, onSkyCommit, onScrub, ringLabel, controlsRef } = opts;
  const instRef = useRef(null);

  // Mount exactly once — the instrument now re-tints in place on theme change
  // (see the refresh effect below) instead of tearing down + replaying assembly.
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return undefined;
    const inst = mountAstrolabe(canvas, wrap, {
      bearingEl: bearingRef?.current,
      onSpeed,
      onDetent,
      onSkyCommit,
      onScrub,
      ringLabel,
    });
    instRef.current = inst;
    if (controlsRef) controlsRef.current = inst;
    return () => {
      inst.destroy();
      instRef.current = null;
      if (controlsRef) controlsRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-read CSS tokens on theme/sky change without a remount.
  useEffect(() => {
    instRef.current?.refresh();
  }, [skyKey]);
}
