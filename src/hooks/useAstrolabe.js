import { useEffect } from 'react';
import { mountAstrolabe } from '../lib/astrolabe';

/**
 * Mounts the Canvas2D astrolabe (src/lib/astrolabe.js) onto the given refs and
 * tears it down on unmount. Re-mounts whenever `themeKey` changes so the engine
 * re-reads the CSS theme tokens.
 *
 * @param {React.RefObject<HTMLCanvasElement>} canvasRef
 * @param {React.RefObject<HTMLElement>} wrapRef    square wrapper sizing the canvas
 * @param {React.RefObject<HTMLElement>} bearingRef optional live bearing readout
 * @param {string} themeKey  re-mount trigger (e.g. resolvedTheme)
 * @param {(radPerSec: number) => void} [onSpeed]  per-frame needle angular-speed
 *        report (rad/s) — used to drive the gear sound in sync with the needle.
 */
export function useAstrolabe(canvasRef, wrapRef, bearingRef, themeKey, onSpeed) {
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return undefined;
    return mountAstrolabe(canvas, wrap, { bearingEl: bearingRef?.current, onSpeed });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [themeKey]);
}
