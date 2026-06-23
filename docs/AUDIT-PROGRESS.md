# Audit Progress — Before / After

Work log for the fixes from [`AUDIT.md`](./AUDIT.md). Date: **2026-06-23**.
Methodology: metrics captured from a clean `npm run build` + `npm run lint` +
`du`/`node` on the same machine, before any change and after this batch.

## Metrics at a glance

| Metric | Before | After | Δ |
|---|---|---|---|
| **Lint** (`npm run lint`, `--max-warnings 0`) | **234** (210 err, 24 warn) ❌ | **0** ✅ | **−234** |
| Build | clean (~2.8s) | clean (~3.0s) | — |
| **JS bundle** (gzip, all chunks) | 166.0 KB | 166.1 KB | ~0 |
| CSS (raw) | 40.3 KB | 39.4 KB | −0.9 KB |
| **Prod dependencies** | 15 | **9** | **−6** |
| Total deps (prod+dev) | 28 | 21 | −7 |
| **node_modules** | 183 MB | **171 MB** | **−12 MB** |
| Installed package dirs | 278 | 270 | −8 |
| `tailwind.config.js` | ~88 lines, mixed tabs, phantom tokens | ~25 lines, clean | rewritten |
| Dead root files | `components.json`, `_shoot.mjs`, `.DS_Store` | removed | −3 |
| Stale `docs/*.md` | 5 in `docs/` root | archived → `docs/_archive/` | moved |
| README | false (3D/Three.js/EmailJS) | accurate (The Chronicle) | rewritten |
| Contact API abuse controls | none | honeypot + length caps + `noopener` | hardened |
| CI | none | lint+build gate (Node 24) | added |
| Latent CSS bug | `rounded-lg/md` → undefined `--radius` (square corners) | fixed (proper radius) | ✅ |

## Honest read on "performance / bundle size"

**Runtime bundle barely moved (166.0 → 166.1 KB gzip), and that's expected.** The
5 removed dependencies (`motion`, `clsx`, `tailwind-merge`,
`class-variance-authority`, `@gsap/react`) were **never imported**, so they were
already tree-shaken out of the bundle. Removing them does **not** shrink what ships
to users — it shrinks the **install/supply-chain surface**:

- **node_modules −12 MB**, **−6 prod deps**, **−8 packages** → faster `npm ci`,
  smaller attack surface, less to audit, clearer intent.
- **CSS −0.9 KB** from pruning the dead Tailwind plugin + phantom utilities.

So the wins here are **code quality, correctness, security, and maintainability** —
not user-facing payload. The payload was already lean (initial JS well under the
~200 KB-gz budget). Stated plainly so the numbers aren't oversold.

## What changed (by audit ID)

### ✅ Done
- **A1 — lint 234 → 0.** Root causes fixed, not suppressed wholesale:
  - **B1** `.eslintrc.cjs`: added a Node-env `overrides` block for config + `api/`
    files (killed 15 `no-undef`); disabled `react/prop-types` (JS app, no
    prop-types — 109 false positives) and `react/no-unescaped-entities` (4).
  - **B9** rewrote `tailwind.config.js` with 2-space indent → cleared **77**
    `no-mixed-spaces-and-tabs`.
  - Fixed the 5 real `no-unused-vars` (`React`/`Suspense`/`lazy`/`useEffect`/`Compass`).
  - Turned off `react-refresh/only-export-components` (24 warns): it conflicts with
    the **intentional** colocated-sub-components + `SectionWrapper` HOC pattern;
    Fast Refresh still works (those modules full-reload in dev). Removed the now-unused
    `eslint-plugin-react-refresh` dep.
- **B5/B6 — removed 6 dead deps** (the 5 above + `tailwindcss-animate`, plugin loaded
  but no `animate-*` utilities used).
- **B9 — `tailwind.config.js` pruned** from phantom shadcn tokens
  (`hsl(var(--primary))`, `--card`, `--popover`, `--chart-*`, `--ring`, …, none of
  which exist in `index.css`) to the real design-system tokens. **Fixed a latent bug:**
  the `borderRadius` override mapped `rounded-lg/md` to an **undefined `--radius`**,
  silently squaring those corners — removing it restores proper rounding. Also fixed
  `darkMode: ['class','class']` → `'class'`; dropped unloaded `poppins` font and the
  unused `colors`/`animation`/`backgroundImage` blocks.
- **B10 — de-duped `CompassRose`.** Renamed the inline one in Contact → `ContactCompass`
  (the shared `components/CompassRose` is the sigil).
- **A2 — rewrote `README.md`** (was the old 3D/Three.js/EmailJS template — entirely false).
- **B7/B8/C5–C8 — file & doc rot:** deleted dead `components.json` (shadcn) and stray
  `_shoot.mjs` (imported an uninstalled `puppeteer-core`); archived the 5 superseded
  `docs/*.md` → `docs/_archive/` with a pointer; removed `.DS_Store`; fixed the stale
  "Three.js is large" comment + lowered `chunkSizeWarningLimit` 1000 → 600; renamed
  package `3d-portfolio@0.0.0` → `manan-upadhyay-portfolio@1.0.0`.
- **C1/C2/C3 — contact endpoint hardened:** added a **honeypot** (`company` hidden
  field — bots get a fake success, nothing sends) end-to-end (client → handler →
  sender); **server-side length caps** (name 120 / email 200 / message 5000 /
  inquiry 60); `window.open(..., 'noopener,noreferrer')` in MapOverlay. Verified all
  paths (honeypot/invalid/oversized/missing → correct results).
- **B4 — CI added** (`.github/workflows/ci.yml`): `npm ci` → `lint` → `build` on
  Node 24 for every push to `main` and every PR. This locks in the green state.

### ⏳ Deferred (logged, not done this batch)
- **C1 (part) — per-IP rate limiting.** Honeypot + caps shipped; a true throttle
  needs durable storage (Vercel KV / Upstash) — left as backlog.
- **B11 — extract the astrolabe** from `Hero.jsx` (430 lines) into `lib/astrolabe.js`
  + a hook. Larger refactor; deferred to keep this batch low-risk.
- **B3 — typecheck / TS migration** (decide: enforce `tsc --noEmit` + migrate, or
  drop the aspirational TS config).
- **C4** dev-middleware body-size guard (dev-only, low risk).
- **C9** split `constants/index.js` (545 lines) into modules.
- **C10** adopt the `@`-aliases repo-wide or drop them.

## Verification
- `npm run lint` → **0 problems** (exit 0).
- `npm run build` → clean.
- Headless screenshot of `/` → no visual regression (and `rounded-lg` elements now
  render with correct radius).
- `sendRaven()` unit-checked: honeypot → `{ok:true}` (drops); invalid/oversized/
  missing → `{ok:false, code:'INVALID'}`.
