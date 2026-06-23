# Section 05 — Summon (Contact)

**Component:** `src/sections/Contact.jsx` · **id:** `contact` · **Status:** built
(server-side Resend; no Three.js).

## Purpose
The closing call to action. Confident, editorial, frictionless: a big statement,
an inquiry-typed message form, and clear correspondence channels + availability.
Reference: breedlove contact section.

## Layout (breedlove-style, no globe)
- `ChapterHeading no="05" eyebrow="Summon" title="Send a Raven."` (or a big
  statement headline: "Let's build something worth charting.").
- Availability line: open to roles, location/remote, response time.
- **Two columns:**
  - **Left — the message:** inquiry-type chips (Senior role / Contract / Design /
    Other), Name, Email, Note, submit ("Dispatch the Raven"). Posts to Resend.
  - **Right — correspondence:** Email, LinkedIn, GitHub, Location (with a subtle
    coordinate flourish), each a row with a lucide icon + `ArrowUpRight`. Optional
    "Copy email" + "Book a call".
- Replace the 3D globe with a lightweight themed accent: a **CSS/SVG compass or
  constellation**, or a faint map texture — transform/opacity only, no WebGL.

## Motion
- Fields/rows stagger in on scroll (Framer `whileInView`).
- Inquiry chips: spring select; submit button: ember fill + loading state +
  success ("Your raven has taken flight…").
- Subtle ambient on the accent (slow rotate/drift), reduced-motion safe.

## Content (from `constants.personalInfo` + `constants.summon`)
`email`, `linkedin`, `github`, `location`, availability + all form copy/error
variants. The form posts to a **server-side Resend** endpoint (Vite dev
middleware `ravenApiDev` locally / a serverless function in prod) — the API key
never reaches the client. Validate required fields + email format.

> Three.js is fully removed (no `EarthCanvas`, `components/canvas/`, `Loader`, or
> `@react-three/*`/`three`/`maath`). Do not reintroduce WebGL.

## Accessibility / performance
- Labels tied to inputs; errors announced; submit disabled while sending; keyboard
  + screen-reader complete. AA contrast (light mode).
- No WebGL. Accent is cheap. Reduced-motion: static.

## Acceptance criteria
- [x] Three.js fully removed from the codebase + bundle; build clean & smaller.
- [x] Statement + inquiry chips + form (server-side Resend) + channels + availability.
- [x] Themed non-WebGL accent; dark+light correct; responsive.
- [ ] Validation, loading, success, and error states all handled.
