# Performance & SEO Audit (June 2026)

## Overview
A comprehensive audit of the portfolio was conducted using Google Search Console and PageSpeed Insights (Mobile and Desktop). The goal was to achieve a perfect 100 PageSpeed score, resolve mobile rendering bottlenecks, and ensure the site is fully indexable by both traditional search engines (Google) and Agentic Browsing systems (AI tools like Claude, Gemini, ChatGPT).

## Issues Identified & Solutions Implemented

### 1. Agentic Browsing (WebMCP / AI SEO) Readiness
* **Issue:** AI agents evaluate sites differently than Google. The site lacked an `llms.txt` file (the emerging standard for LLM crawler mapping), costing discoverability points.
* **Fix:** 
  - Created `public/llms.txt` containing a required `H1` header and a clean, markdown-formatted map of Manan's full experience (MERN stack, enterprise apps, startups, high-performance frontends).
  - Linked it via `<link rel="alternate" type="text/markdown" href="/llms.txt" />` in `index.html`.
  - Updated meta tags in `index.html` to explicitly target high-value queries: "best software developer in india", "hire expert full stack developer", "MERN stack developer", and "enterprise software developer".

### 2. Massive Network Payloads (Image Optimization)
* **Issue:** Mobile LCP was severely impacted (10.5s) by an overall page weight of ~10.7 MB. The primary culprits were massive, unoptimized PNG assets (`gajaakriti-hero.png` at 7.6MB, `logo-light.png` at 1.8MB, and `royal-tiles-dashboard.png` at 361KB).
* **Fix:** 
  - Used the `cwebp` encoder to compress these images into `.webp` format.
  - `gajaakriti-hero.png` (7.6 MB) -> `gajaakriti-hero.webp` (382 KB).
  - `logo-light.png` (1.8 MB) -> `logo-light.webp` (24 KB).
  - `royal-tiles-dashboard.png` (361 KB) -> `royal-tiles-dashboard.webp` (69 KB).
  - Total savings: ~9.7 MB. Code references across constants and components were updated accordingly.

### 3. Render-Blocking CSS
* **Issue:** The main CSS bundle (`index-b55235fc.css`, ~20KB) was halting the critical rendering path for 590ms on mobile, causing an "Element Render Delay" of 1.1s for the LCP text.
* **Fix:** 
  - Wrote a custom Vite Rollup plugin (`inline-css` in `vite.config.js`) to extract the CSS file during the build and inject the raw styles directly into a `<style>` tag inside the HTML `<head>`.
  - The CSS is no longer emitted as a separate network request.

### 4. Legacy JavaScript Polyfills
* **Issue:** Vite was transpiling modern JavaScript (`Array.from`, `Math.trunc`) down for legacy browsers. This bloated both first-party code and third-party vendors (like PostHog), inflating the mobile script evaluation time to 1.4s.
* **Fix:** 
  - Updated `vite.config.js` with `build: { target: 'esnext' }`. The app now serves modern, lighter JS directly to browsers that support it.

### 5. Third-Party Network Latency
* **Issue:** The connection setup for third-party scripts (PostHog telemetry and IPWhois) was creating 680ms of network overhead.
* **Fix:** 
  - Added `<link rel="preconnect" href="https://us.i.posthog.com" crossorigin />` and `<link rel="preconnect" href="https://ipwho.is" crossorigin />` to `index.html` to establish early connections.

### 6. Non-Composited Animations
* **Issue:** The `.raven-console__pip` blinking animation was using `box-shadow` pulses. This property is not GPU-accelerated and triggers a forced layout repaint on the main thread every frame.
* **Fix:** 
  - Refactored the animation in `src/index.css` to use a pseudo-element (`::after`) with `transform: scale()` and `opacity`, moving the calculation to the GPU.

## Technical Debt & Remaining Considerations

### 1. Forced Reflows from Complex Scroll Architecture
* **Issue:** PageSpeed still flags some forced reflows (`offsetWidth` / `getBoundingClientRect` queries) originating from `react-vendor` and `animation-vendor`.
* **Explanation:** These are artifacts of GSAP's `ScrollTrigger` setup. To pin the horizontal `Experience` timeline and sync the `Lenis` smooth-scroll engine, GSAP *must* read the exact geometric DOM bounds upon mounting and resizing. 
* **Debt Action:** This is acceptable and optimized as much as possible for a cinematic portfolio. Do not attempt to strip these measurements unless migrating away from GSAP entirely (not recommended).

### 2. PostHog "Long Main-Thread Tasks"
* **Issue:** The `posthog-recorder.js` triggers a ~106ms long task upon initialization.
* **Explanation:** This is PostHog's Session Replay booting up. It is currently initialized synchronously in `src/main.jsx`. 
* **Debt Action:** If ultimate purity is required, this could be migrated to run in a web worker using Partytown, but the effort-to-reward ratio is low since it does not block the initial HTML/CSS render.
