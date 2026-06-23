# Repo Audit & Improvement Backlog

> End-to-end audit of architecture, structure, code quality, standards, reuse,
> duplication, security, scalability, and readability. Date: **2026-06-23**.
> Severity: **P0** = fix soon / correctness or trust · **P1** = should fix ·
> **P2** = nice-to-have / polish.
>
> **🟢 STATUS:** Batches 1–2 done. See [AUDIT-PROGRESS.md](./AUDIT-PROGRESS.md) for
> before/after. Lint **234 → 0**; **typecheck enforced**; `Hero.jsx` **430 → 215**
> (astrolabe extracted); 6 dead deps + 8 dead aliases removed; tailwind/README/dead
> files fixed; contact endpoint hardened (honeypot + caps + body guard); form focus
> a11y fixed; CI gates lint+typecheck+build.
> **Resolved:** A1, A2, B1, B2, B3, B4, B5, B6, B7, B8, B9, B10, B11, C2, C3, C4,
> C5, C6, C7, C8, C10, C11, C12, C13 (+ honeypot).
> **Deferred (rationale in progress log):** C1 (per-IP rate-limit — needs KV),
> C9 (constants split — low ROI), full Prettier.

## Health snapshot

| Area | State |
|---|---|
| Build (`npm run build`) | ✅ clean |
| Lint (`npm run lint`, `--max-warnings 0`) | ❌ **234 problems (210 errors)** |
| Typecheck | ⚠️ none (tsconfig strict but unenforced) |
| CI | ❌ none |
| Contact API security | ✅ solid core, ⚠️ no rate-limit / length caps |
| Secrets | ✅ `.env` gitignored, example has placeholders only |
| Dead deps | ❌ 5 unused |
| Doc/file rot | ❌ README + `docs/*.md` + shadcn configs stale |

What's already strong (keep): server-side validation + HTML escaping + server-only
key + idempotency in the contact API; single-source `chapters`; clean
`sections/` vs `components/` split; lazy sections + `ErrorBoundary`; theme-token
discipline; reduced-motion fallbacks throughout.

---

## P0 — fix soon

### A1. `npm run lint` is fully red (234 problems / 210 errors)
The lint script uses `--max-warnings 0` and currently fails hard; only `vite build`
(esbuild, no lint) stays green. Breakdown by rule:
| Count | Rule | Nature |
|---|---|---|
| 109 | `react/prop-types` | false positives — JS app with no prop-types |
| 77 | `no-mixed-spaces-and-tabs` | formatting (almost all `tailwind.config.js`) |
| 24 | `react-refresh/only-export-components` | barrels/constants beside components |
| 15 | `no-undef` | `process`/`__dirname`/`require` in config + `api/` (no node env) |
| 5 | `no-unused-vars` | real dead vars |
| 4 | `react/no-unescaped-entities` | apostrophes in JSX (e.g. "I've") |

Fix is mostly config (A2) + a formatter (A3) + a handful of real edits. Until green,
lint provides no signal.

### A2. README.md is the old template (false)
`README.md` still describes "**3D Portfolio… Three.js… Earth globe… EmailJS… 4+
years**" — none of which is true after the revamp. First thing a visitor/recruiter
reads. **Rewrite** to The Chronicle (no 3D, Resend contact, 5+ yrs, real stack).

### A3. Secret-handling & API core are good — but note for trust
(Not a defect — recording the verified-good state.) `api/_lib/sendRaven.js`
validates server-side, **escapes all user input** into the email HTML, keeps
`RESEND_API_KEY` server-only (no `VITE_` prefix), gates method, and uses an
idempotency key. `.env` is gitignored; `.env.example` holds placeholders. Keep this bar.

---

## P1 — should fix

### Tooling / standards
- **B1. ESLint config gaps** (`.eslintrc.cjs`): add an `overrides` block giving
  `*.config.js`, `*.cjs`, and `api/**` `env: { node: true }` (kills the 15
  `no-undef`); **disable `react/prop-types`** for this no-prop-types JS app (kills
  109) — or commit to TypeScript instead.
- **B2. No formatter.** Add **Prettier** + a `format` script and an editorconfig;
  fixes the 77 mixed tab/space errors and prevents recurrence. `tailwind.config.js`
  is the main offender.
- **B3. No typecheck.** `tsconfig.json` is `strict` + `noUnusedLocals` but nothing
  runs `tsc`. Decide: (a) add `"typecheck": "tsc --noEmit"` and migrate `.jsx→.tsx`
  incrementally, or (b) drop the aspirational TS config to avoid false confidence.
- **B4. No CI.** Add a GitHub Action gating `lint` + `build` (+ typecheck) on PRs so
  the above can't regress.

### Dependencies (`package.json`)
- **B5. 5 dead dependencies** (0 imports anywhere): `motion` (duplicate of
  `framer-motion`), `clsx`, `tailwind-merge`, `class-variance-authority`,
  `@gsap/react`. Plus **`tailwindcss-animate`** (plugin loaded but **no `animate-*`
  utilities used**). Remove → smaller install, clearer intent. Leftovers from the
  shadcn/react-bits experiment + the removed `cn()`.
- **B6. Two animation libs of the same family** (`motion@12` + `framer-motion@10`).
  Standardize on `framer-motion` (what the code imports).

### Dead files / config rot
- **B7. `components.json`** (shadcn config) is dead — points at removed
  `@/lib/utils`, `@/components/ui`, and the `@react-bits` registry. Delete.
- **B8. `docs/*.md`** (`AI_DEVELOPMENT`, `ARCHITECTURE`, `COMPONENTS`,
  `CONTRIBUTING`, `ROADMAP`) are pre-revamp and **explicitly superseded** by
  `docs/chronicle/` (per CLAUDE.md) — but still present and contradictory. Delete or
  move to `docs/_archive/` with a one-line pointer.
- **B9. `tailwind.config.js` is mostly phantom shadcn tokens.** The whole `colors`
  block maps to `hsl(var(--primary))`, `--card`, `--popover`, `--chart-1..5`,
  `--destructive`, `--ring`, `--input`, `--border` — **none of which exist in
  `index.css`** (the real tokens are `--color-*`). So `bg-primary`/`bg-card`/etc.
  silently resolve to nothing. Prune to what's real (`screens.xs`, the `chronicle`/
  `display` fonts, `boxShadow.card/glow`, `backgroundImage`, the used `animation`s).
  Also: `darkMode: ['class','class']` (dup), `fontFamily.poppins` (Poppins isn't
  loaded), `borderRadius` uses undefined `--radius`.

### Duplication / reuse
- **B10. Two components named `CompassRose`.** The shared
  `components/CompassRose.jsx` (star, 64-viewBox) **and** a different inline
  `CompassRose` in `Contact.jsx:63` (needle, 120-viewBox). Same name, different art →
  confusing. Rename the Contact one (e.g. `ContactCompass`) or unify on the shared one.

### Architecture / readability
- **B11. `Hero.jsx` (430 lines)** carries the Canvas2D astrolabe as one ~200-line
  inline `useEffect`. Extract the engine to `lib/astrolabe.js` (pure draw/update) + a
  thin `useAstrolabe` hook — improves readability, testability, and reuse.

---

## P2 — polish / nice-to-have

### Security hardening (API is solid; these are depth-in-defense)
- **C1. No anti-abuse on the contact endpoint** (`api/_lib/sendRaven.js`): no
  honeypot field, rate-limit, or per-IP throttle → spam / Resend-quota burn. Add a
  hidden honeypot input + a lightweight per-IP throttle (e.g. Vercel KV / Upstash).
- **C2. No length caps** server-side on `name`/`email`/`message` → oversized payloads.
  Add max lengths (e.g. 120 / 200 / 5000) in `sendRaven`.
- **C3. `window.open(url, '_blank')` in `MapOverlay.jsx:51-53`** lacks `'noopener'`
  (reverse-tabnabbing on old browsers). Pass `'noopener,noreferrer'`. (Anchor `<a>`
  links already use `rel="noopener noreferrer"` — good.)
- **C4. Dev middleware** (`vite.config.js`) accumulates the request body unbounded
  (`raw += c`) — add a size guard. Dev-only (Vercel caps prod), low risk.

### Cleanup
- **C5. `_shoot.mjs`** (root) imports `puppeteer-core`, which **isn't a dependency** —
  it would fail to run. Move to `tools/` (and add the dep as `devDependency`) or delete.
- **C6. Stale `vite.config.js`**: comment *"Increase chunk size warning (Three.js is
  large)"* + `chunkSizeWarningLimit: 1000` — Three.js is gone. Lower/remove.
- **C7. `package.json`** `name: "3d-portfolio"` / `version: "0.0.0"` — rename
  (it's no longer 3D); set a real version if you want release tracking.
- **C8. `.DS_Store`** present at repo root (gitignored, but delete the local file).

### Architecture / scalability
- **C9. `constants/index.js` (545 lines)** — one big data file. Optional: split into
  `constants/{personal,chapters,experience,projects,skills}.js` + a barrel for scale.
- **C10. `@`-path aliases** are defined in `vite.config.js` **and** `tsconfig.json`
  but **unused** (code is all relative imports). Either adopt them repo-wide or drop
  them so they don't drift from the tree again.
- **C11. TS half-adoption** — only `store/useThemeStore.ts` is TS. Pairs with B3:
  commit or simplify.

### Accessibility / perf (spot-check)
- **C12. Contact form** has 3 fields and 5 label/aria refs — looks covered; verify
  every input has an associated `<label htmlFor>` (not placeholder-only) and a
  visible focus ring in both themes.
- **C13.** 70 twinkling star spans + Canvas rAF + aurora loops — within budget;
  keep verifying reduced-motion disables each (mostly done) on new motion.

---

## Suggested order of attack (quick wins first)
1. **B5/B6** remove 5 dead deps (1 command, instant clarity).
2. **B1** ESLint env + disable `react/prop-types` → drops ~124 errors.
3. **B2** add Prettier + format → clears the 77 tab/space errors. Lint now near-green.
4. **A2/B7/B8/C5–C8** doc & dead-file cleanup (README rewrite, drop `components.json`,
   archive `docs/*.md`, move `_shoot.mjs`, fix vite comment).
5. **B9** prune `tailwind.config.js` to real tokens.
6. **B10** dedupe `CompassRose`; **fix remaining real `no-unused-vars`** → lint green.
7. **B4** add CI to lock it in.
8. **C1/C2/C3** contact-endpoint hardening.
9. **B11 / B3 / C9–C11** larger refactors when there's runway.
