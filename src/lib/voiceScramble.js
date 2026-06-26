// Voice-change text scramble (LEGENDARY-ROADMAP §4 follow-up). When the voice
// switches, every visible piece of text on screen briefly *decodes* into its new
// wording — characters scramble through random glyphs, then lock to the final
// text left-to-right-ish (the "Scrambled Text" effect). Content-level, per-text,
// no full-screen overlay.
//
// DOM-driven (framework-agnostic): we walk the live text nodes, capture the NEW
// text (read just after React commits), scramble in place, resolve over ~720ms,
// then restore the exact target so React's virtual DOM stays consistent. Pure
// reads/writes of `nodeValue` — no React wrapping of every `t()` call.

const GLYPHS = '!<>-_\\/[]{}—=+*^?#%&$@ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const EXCLUDE_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'INPUT', 'TEXTAREA', 'SELECT', 'OPTION', 'CANVAS']);
const MAX_NODES = 600; // safety cap

const rand = (s) => s[(Math.random() * s.length) | 0];

// Collect visible, on-screen text nodes worth scrambling.
function collectTextNodes(root) {
  const out = [];
  const vh = window.innerHeight || 0;
  const vw = window.innerWidth || 0;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const v = node.nodeValue;
      if (!v || !v.trim()) return NodeFilter.FILTER_REJECT;
      const p = node.parentElement;
      if (!p || EXCLUDE_TAGS.has(p.tagName)) return NodeFilter.FILTER_REJECT;
      if (p.closest('[data-no-scramble]')) return NodeFilter.FILTER_REJECT;
      const r = p.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return NodeFilter.FILTER_REJECT;
      if (r.bottom < 0 || r.top > vh || r.right < 0 || r.left > vw) return NodeFilter.FILTER_REJECT; // off-screen
      const cs = getComputedStyle(p);
      if (cs.visibility === 'hidden' || cs.opacity === '0') return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  let n;
  while ((n = walker.nextNode()) && out.length < MAX_NODES) out.push(n);
  return out;
}

let cancelCurrent = null;

/**
 * Run the scramble across the page's visible text. Call right after the voice
 * (i18next language) has changed; it waits one frame for React to commit the new
 * copy, then decodes it in. Safe to call repeatedly (restarts cleanly). No-op
 * under reduced-motion.
 *
 * @param {{ duration?: number }} [opts]
 */
export function runVoiceScramble({ duration = 720 } = {}) {
  if (typeof window === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (cancelCurrent) cancelCurrent();

  let raf = 0;
  // Wait one frame so the DOM holds the NEW (post-change) text; capture that as
  // each node's target and scramble before the browser paints it clean.
  const setup = requestAnimationFrame(() => {
    const root = document.getElementById('root') || document.body;
    const items = collectTextNodes(root).map((node) => {
      const target = node.nodeValue;
      const len = target.length;
      const lock = new Float32Array(len);
      for (let i = 0; i < len; i++) {
        // left-to-right bias + randomness → a decoding sweep, not a uniform pop.
        lock[i] = (i / Math.max(len, 1)) * duration * 0.35 + Math.random() * duration * 0.45;
      }
      return { node, target, lock };
    });

    const start = performance.now();
    const restore = () => { for (const it of items) if (it.node.parentElement) it.node.nodeValue = it.target; };

    const step = (t) => {
      const el = t - start;
      let pending = false;
      for (const it of items) {
        if (!it.node.parentElement) continue; // node removed mid-flight
        const { target, lock } = it;
        let s = '';
        for (let i = 0; i < target.length; i++) {
          const ch = target[i];
          if (ch === ' ' || ch === '\n' || ch === '\t') { s += ch; continue; }
          if (el >= lock[i]) s += ch;
          else { s += rand(GLYPHS); pending = true; }
        }
        it.node.nodeValue = s;
      }
      if (pending && el < duration) raf = requestAnimationFrame(step);
      else { restore(); cancelCurrent = null; }
    };
    raf = requestAnimationFrame(step);
    cancelCurrent = () => { cancelAnimationFrame(raf); restore(); cancelCurrent = null; };
  });

  cancelCurrent = () => { cancelAnimationFrame(setup); cancelAnimationFrame(raf); cancelCurrent = null; };
}
