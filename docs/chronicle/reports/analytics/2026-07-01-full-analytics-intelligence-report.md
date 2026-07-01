# Chronicle Portfolio – Full Analytics Intelligence Report (July 1, 2026)

# Chronicle portfolio – full analytics intelligence report

**Generated:** July 1, 2026 · **Data sources:** PostHog Web Analytics + 5 Production Dashboards **Time windows:** Last 24 hours (web snapshot) + Last 30 days (product analytics)

---

## SECTION 1 — Web analytics snapshot (last 24 hours)

### Traffic volume

- **Unique visitors:** 343
- **Total pageviews:** 347
- **Sessions:** 343
- **Pages per session:** ~1.01 (single-page site, expected)
- **New vs. returning:** Jun 30 showed 14 new / 6 returning; Jul 1 shows 16 new / 2 returning (returning_visitor super-property confirms meaningful repeat rate)

### Session quality (from session_recap, last 24h)

- **Total session_recap events fired:** 123
- **Avg session duration:** ~69 seconds (1 min 9 sec)
- **Avg max scroll depth:** 43.9%
- **Avg sections viewed per session:** 3.81
- **Sessions that reached contact section:** 41 (33.3% of session_recap pool)
- **Sessions that converted (contacted = true):** 0 in the last 24h
- **Avg voices tried per session:** 0.08 (near-zero; voice adoption is low)

### Top pages (last 24h)

| URL | Pageviews | Unique visitors |
| --- | --- | --- |
| upadhyaymanan.in/ (homepage) | 337 | 337 |
| upadhyaymanan.in/making-of | 9 | 9 |
| Homepage + Facebook tracking param | 1 | 1 |

**Actionable note:** `/making-of` is getting organic secondary traffic — 9 sessions voluntarily navigated there. This page is earning attention. Consider enriching it, adding a CTA, and linking it more prominently from the homepage.

### Traffic sources (last 24h)

| Source | Unique visitors |
| --- | --- |
| Direct | 204 (59%) |
| Reddit (desktop [www.reddit.com](http://www.reddit.com)) | 73 (21%) |
| Reddit (mobile app com.reddit.frontpage) | 58 (17%) |
| Facebook (l.facebook.com) | 2 |
| LinkedIn ([www.linkedin.com](http://www.linkedin.com)) | 2 |
| Google (organic) | 1 |
| GitHub | 1 |

**Critical insight:** Reddit is the #1 referral source at ~131 visitors combined (38% of all traffic with a known referrer). The site is going viral or being shared actively on Reddit. This is a huge acquisition lever — identify which subreddits and double down. There is currently almost zero SEO traffic (1 Google visitor) — entirely social-driven at this stage.

### Geography (last 24h)

| Country | Unique visitors |
| --- | --- |
| United States | 130 (38%) |
| India | 39 (11%) |
| United Kingdom | 26 (8%) |
| Canada | 14 (4%) |
| Germany | 11 |
| Vietnam | 11 |
| France | 10 |
| Netherlands | 7 |
| Australia | 7 |
| Angola | 6 |
| Pakistan | 6 |
| Sweden, Spain, Italy, Belgium, Philippines | 5 each |
| Algeria, Mexico, Indonesia, Finland | 3 each |

**Actionable note:** Strong US dominance (38%) is great for senior-role hiring intent. Surprisingly diverse tail — 20 countries with visitors. India at 11% is notable for freelance/collaboration inquiries.

### Devices & browsers (last 24h)

**OS breakdown** (custom super-property; note ~309/343 show null — super property may not fire before first event, investigate):

- macOS: 16 | Windows: 11 | Android: 9 | Linux: 2

**Browser breakdown** (same caveat on null rate):

- Firefox: 20 | Chrome: 16 | Safari: 1 | Edge: 1

**Data quality flag:** ~90% of sessions show null for device_os and device_browser. This strongly suggests the super-property registration fires after the $pageview event, causing the custom super properties to not be attached to the first event. This is a tracking instrumentation bug — fix priority: high.

---

## SECTION 2 — Acquisition & first impression (last 30 days)

### Visitor volume trend

Traffic only started meaningfully on June 29 (12 visitors), spiked to 213 on June 30, and 133 on July 1 (partial day). The site is brand new or was just shared. All meaningful analytics data is from the last ~2–3 days, despite a 30-day window.

### New vs. returning

- Jun 30: 14 new, 6 returning
- Jul 1: 16 new, 2 returning
- Returning visitors exist — people are coming back, which is a strong signal for a portfolio.

### Browser breakdown (30d, custom super-property)

| Browser | Unique visitors |
| --- | --- |
| None (not captured) | 325 |
| Firefox | 20 |
| Chrome | 18 |
| Edge | 1 |
| Safari | 1 |

Among identified visitors: Firefox leads Chrome slightly, which skews toward developer/power-user audience.

### OS breakdown (30d)

| OS | Unique visitors |
| --- | --- |
| None (not captured) | 325 |
| macOS | 18 |
| Windows | 11 |
| Android | 9 |
| Linux | 2 |

Among identified: macOS at 45%, consistent with tech/design audience. Android at 23% of identified — mobile segment is real and non-trivial.

### Avg scroll depth (bounce proxy)

- **41.79%** — visitors scroll roughly halfway down on average. More than half the page (contact, projects, etc.) is not being seen by the average visitor. This is the single most important number to improve.

### Hero CTA split (30d)

- **"About" clicked:** 32 (64%) — curious visitors, exploring who you are
- **"Contact" clicked:** 18 (36%) — visitors arriving ready to hire

**Actionable note:** The majority arrive curious, not ready to hire. The about section must do a better job converting curiosity into hiring intent. The 36% direct-to-contact rate is actually high for cold traffic — the hero copy is working for a subset.

### First-touch engagement (30d)

- **Sound first played:** 309 unique sessions — nearly everyone who lands hears the site. Sound autoplay/interaction is near-universal.
- **Astrolabe dragged:** 97 unique sessions (27% of all visitors)
- **Astrolabe spun:** 51 unique sessions (14%)

**Actionable note:** Sound is the #1 first-touch engagement moment by a massive margin. The astrolabe is engaged by a smaller but meaningful portion. These two elements are the hero's real interactive hooks.

---

## SECTION 3 — Engagement & discovery (last 30 days)

### Section heatmap (unique sessions that viewed each section)

| Section | Unique sessions |
| --- | --- |
| origin (hero) | 355 |
| about | 299 (84%) |
| work | 247 (70%) |
| arsenal | 189 (53%) |
| projects | 177 (50%) |
| contact | 132 (37%) |

**Dropoff pattern:** ~16% leave before reading About. ~30% leave before Work. ~47% leave before Arsenal. ~50% leave before Projects. Only 37% reach Contact. Each section loses ~13–17% of remaining visitors. The biggest single drop is Origin → About (16 percentage points). This is where the hero needs to do more work.

### Scroll depth funnel (30d, n=240 who hit 25%)

| Milestone | Visitors | Cumulative rate |
| --- | --- | --- |
| 25% scroll | 240 | 100% (base) |
| 50% scroll | 180 | 75% |
| 75% scroll | 139 | 58% |
| 100% scroll | 94 | 39% |

39% of visitors who scrolled at all made it to the bottom. This is respectably high for a long single-page portfolio. Median time to hit each milestone: 7s → 10s → 11s (fast scrollers; people are moving quickly, not reading deeply).

### Discovery funnel (30d)

| Step | Users | Conversion |
| --- | --- | --- |
| Landed on site | 358 | 100% |
| Spun the astrolabe | 51 | 14.25% |
| Opened the Voice Hall | 4 | 1.12% |
| Reached the Atelier | 0 | 0% |

**Critical finding:** The Atelier has ZERO reach. Voice Hall has only 4 visitors (1.12% of all). These are the deepest, most unique layers of the site — they are essentially invisible. The path to discovery is too long or too obscure.

### Deep feature adoption (30d, unique sessions)

| Feature | Unique sessions |
| --- | --- |
| Expedition reached | 106 |
| Carousel opened | 40 |
| Arsenal explored | 32 |
| Works show all | 7 |
| Build reel scrubbed | 7 |
| Atelier visited | 11 |
| Persona card expanded | 3 |

**Actionable notes:**

- Expedition section is highly reached (106 sessions) — it's well-positioned in the scroll path.
- Carousel is opened by 40 sessions — interactive gallery is working.
- Build reel scrub (7) and persona card expand (3) are almost undiscovered — these interactive moments need better affordance/visual cues.
- Atelier visits: 11 (despite 0 in the discovery funnel — these came through direct navigation, not the astrolabe → voice hall path).

### Navigation style (30d)

- **Map opened:** 55 times — the map is the most used navigation tool
- **Map jumps (teleport):** 23 times — map is actively used for navigation, not just opened and closed
- **Rail nav clicks:** 14 times — side rail is the least used navigation

**Actionable note:** The map is visitors' preferred navigation method over the rail. Consider promoting the map more visibly, or making the rail more prominent for mobile users.

### Arsenal depth

- **Avg tools hovered per session:** 1.03 — visitors who reach the arsenal barely explore it. They hover on 1 tool on average. The arsenal feels complete but under-explored.

### Project interest (30d)

| Project | Link clicks |
| --- | --- |
| Gajaakriti Studio | 9 |
| Royal Tiles Playground | 3 |

**Link type:** Only "live" links recorded (12 total). No source/GitHub links clicked. Visitors want to see live projects, not read code. Consider making live demos more prominent and ensuring every project has a working live link.

---

## SECTION 4 — Voice & personalization (last 30 days)

### Voice discovery funnel (30d)

| Step | Users | Conversion |
| --- | --- | --- |
| Opened voice switcher | 33 | 100% (base) |
| Selected a voice | 13 | 39.4% |
| Entered the Voice Hall | 2 | 6.06% |

Only 33 of 358 visitors (9.2%) even opened the voice switcher. Of those, 39% tried a voice. The Voice Hall — the deepest layer — was reached by only 2 people total. Median time from switcher to selection: 4 seconds (quick decision-making).

### Voice popularity (30d, total selections)

| Voice | Selections |
| --- | --- |
| plain | 11 |
| chronicle | 6 |
| scott | 4 |
| cow | 2 |
| dwight | 2 |

"Plain" wins — visitors fall back to the default/neutral voice most. "Chronicle" (the signature voice) is second, which is encouraging. Easter egg voices (scott, cow, dwight) each have 2 selections — these are discoveries, not defaults.

### Voices tried per session (30d)

- 0 voices: 123 sessions (94.6%)
- 1 voice: 5 sessions (3.8%)
- 2 voices: 3 sessions (2.3%)
- **Avg voices tried per session: 0.084**

The voice system is deeply underutilized. 95% of sessions never try a single voice. The system is loved by the tiny fraction who find it, but the discovery path is too hidden.

### Easter egg unlocks (30d)

- cow: 2 | scott: 2 | dwight: 1 — total 5 easter egg unlocks across all sessions

The easter eggs are being found, but by a tiny number. These are the kind of moments visitors share — lean into making them more discoverable or hint at their existence.

### Voice wishlist (summon form)

- 1 submission recorded: persona = "test" (likely a self-test; no real user wishlist data yet)

### Sound engagement (30d)

- **Heard the site:** 309 unique sessions
- **Muted it:** 16 unique sessions (5.2% mute rate)

Excellent — 94.8% of visitors who triggered sound kept it on. Sound is additive, not annoying.

### Theme preferences (30d, sky changes)

| Theme | Changes |
| --- | --- |
| night | 99 |
| day | 91 |
| dusk | 64 |
| dawn | 55 |

Total 309 theme switches. Night and day nearly tied. All four themes are being explored. Visitors are actively engaging with the sky/theme switcher — it's one of the most-used interactive features on the site.

**Actionable note:** Theme switching (309 events) dramatically outperforms voice switching (33 events). The theme control is more discoverable. Consider using this discoverability pattern to guide users toward the voice switcher.

---

## SECTION 5 — Conversion & revenue intent (last 30 days)

### Master hiring funnel (30d)

| Step | Users | Overall rate |
| --- | --- | --- |
| Landed on site | 358 | 100% |
| Reached contact section | 131 | 36.6% |
| Started the form | 9 | 2.51% |
| Submitted the form | 2 | 0.56% |
| Sent successfully | 2 | 0.56% |

**Key gaps:**

1. **Reach → Start gap:** 131 reached contact, only 9 started the form (6.9% of those who saw it). The contact section is not compelling enough to prompt action. The CTA copy, form design, or trust signals need work.
2. **Start → Submit gap:** 9 started, 2 submitted (22%). 7 people abandoned mid-form. This is the #1 form UX problem — likely too many fields, intimidating copy, or anxiety at the commitment point.
3. Submit → Success: 100% (2/2) — the form itself sends correctly, no backend errors.

### Leads over time

- Jun 29: 1 lead | Jun 30: 0 | Jul 1: 1 lead (in progress)
- **Total leads in 30-day window: 2**
- Both leads are "Senior role" inquiry type

### Intent by inquiry type

- **Senior role: 2** — 100% of conversions are senior full-time hiring inquiries
- No freelance, collaborate, or other inquiries have converted yet

### Form abandonment funnel

- Started: 9 → Submitted: 2 (22%) → Succeeded: 2 (22%)
- **78% abandonment rate from start to submit** — this is critically high

### Form errors

- **Zero form errors recorded** — the form backend is healthy; all submission failures are behavioral, not technical.

### Soft intent signals (30d)

| Signal | Count |
| --- | --- |
| Channel clicked (any) | 8 unique sessions |
| Résumé opened | 4 unique sessions |
| Email copied | 2 unique sessions |

Total soft intent signals: 14 unique sessions showed strong pre-contact intent. Combined with 2 actual conversions = 14 more potential leads who showed interest but didn't send a message. These people are qualified — the friction at the form is losing warm leads.

### Channel breakdown (30d)

- **GitHub:** 5 clicks
- **LinkedIn:** 3 clicks

GitHub is the preferred channel for visitors who click through. No other channels (email, Twitter/X, etc.) recorded.

### Conversion by device (30d)

| OS | Landed | Reached contact | Started form | Sent |
| --- | --- | --- | --- | --- |
| macOS | 81 | 79 (97.5%) | 8 (9.9%) | 1 (1.23%) |
| Android | 36 | 28 (77.8%) | 1 (2.78%) | 1 (2.78%) |
| Windows | 26 | 21 (80.8%) | 0 | 0 |
| Linux | 4 | 3 (75%) | 0 | 0 |

**Findings:**

- macOS users have the highest contact-section reach rate (97.5%) — near-total engagement.
- macOS has the most form starts but only 1 conversion (1.23%).
- Android surprisingly converted 1 user at 2.78% — mobile conversion is happening.
- Windows users: reached contact in 80.8% but zero form starts. This is a significant UX issue — something about the contact section/form experience on Windows (likely Chrome/Edge rendering) is preventing engagement.
- Note: 211 visitors have no OS data and show 0% reach — this is the super-property data gap issue referenced above.

---

## SECTION 6 — Session quality & technical health (last 30 days)

### Session depth KPIs

- **Avg time on site:** 65.66 seconds (1 min 5 sec)
- **Avg max scroll %:** 41.79%
- **Avg voices tried per session:** 0.084
- **Avg sections viewed per session:** ~3.8 (derived)

### Sections viewed per session distribution (30d)

| Sections viewed | Sessions |
| --- | --- |
| 6 (all sections) | 39 |
| 5 | 22 |
| 3 | 22 |
| 1 | 22 |
| 2 | 18 |
| 4 | 4 |
| 0 | 4 |

**Insight:** 39 sessions saw all 6 sections — these are the deep engagers (top ~30% of session_recap pool). 22 sessions saw only 1 section — quick bounces. The bimodal distribution suggests two clear visitor types: committed explorers and fast bouncers.

### Time on site distribution (30d)

Highly spread — most values in the 1–76 second range with 95 sessions in "other" (i.e., longer). The 12–23 second band dominates the identifiable buckets (3–5 sessions each), suggesting many visitors spend just enough time to get a first impression before leaving.

### Power users — keyboard shortcuts (30d)

- **cmd+k:** 1 unique user
- **shift+cmd+v:** 1 unique user

2 power users found keyboard shortcuts. Both are almost certainly developers. These are high-value visitors.

### Engaged → converted correlation (30d)

- Sessions with 2+ voices tried: peaked at 2 (Jun 30), 1 (Jul 1)
- Sessions that converted: 0 in the same window

**Note:** Sample is too small to draw statistical conclusions, but the pattern is emerging — engaged users (2+ voices) have not yet converted. This could mean: (a) engagement and conversion are decoupled, or (b) the contact CTA isn't reaching engaged visitors effectively.

---

## SECTION 7 — Data quality issues & instrumentation gaps

1. **Super property null rate (~90%):** device_os, device_browser, and other custom super properties are null for ~309/343 visitors. This suggests super properties are registered after the first $pageview fires. Fix: call `posthog.register()` synchronously before any event capture, ideally in the same script that initializes PostHog.

2. **Atelier reached = 0 in discovery funnel:** Despite 11 atelier_view events in deep feature adoption, the funnel (pageview → astrolabe → voice hall → atelier) shows 0. This is because the funnel is ordered and gated — no one completed the exact sequential path. The atelier is being accessed directly (probably via direct link or map navigation), bypassing the intended discovery path.

3. **Voice Hall reach = 1.12%:** The Voice Hall is the gateway to the deepest feature layer. At 1.12%, it's nearly invisible. The astrolabe → voice hall path has a 92% dropoff after the spin.

4. **session_recap coverage:** 123 session_recap events vs. 343 pageviews — only ~36% of sessions have a recap. This is expected (recap fires on page-leave; some visitors close abruptly), but means KPIs derived from session_recap represent a subset.

5. **Windows users: 0% form starts despite 81% contact-section reach:** This is anomalous and likely a rendering/UX bug on Windows browsers (Chrome/Edge). Investigate the contact section layout on Windows Chrome specifically.

6. **/making-of page:** Getting 9 organic visits in 24h — likely linked from Reddit posts. No analytics tracking on this page beyond pageviews (no scroll_depth, no custom events). Instrument it.

---

## SECTION 8 — Actionable prioritization for site improvements

### P0 — Immediate (conversion critical)

1. **Fix the form abandonment (78% drop).** 9 people start, 7 leave. Simplify the form: reduce fields, add social proof near the submit button, soften the commitment language. A "just say hi" entry point alongside the formal inquiry might help.
2. **Fix Windows contact section bug.** 21 Windows users reached contact, 0 started the form. Inspect layout/overflow/z-index issues on Windows Chrome/Edge.
3. **Fix super property registration order.** ~90% of sessions have null device properties — fire `posthog.register()` before the first event.

### P1 — High impact (discovery & engagement)

1. **Make the voice switcher more discoverable.** Theme switcher gets 309 interactions; voice switcher gets 33. They're likely near each other — investigate why theme is found 9x more. Add a subtle visual hint or tooltip nudging toward voice.
2. **Amplify the Reddit moment.** Reddit is driving 38% of all referral traffic. Find the post/thread, engage with it, and consider posting follow-up content or comments. This is an active growth loop.
3. **Add a CTA to /making-of.** 9 visitors in 24h — add a "hire me" or "contact" CTA at the bottom of the making-of page, since people reading it are already highly interested.
4. **Improve hero to About transition.** 16% of visitors leave between hero and About. The scroll-down affordance or first-scroll hook needs work.

### P2 — Medium term (depth & personalization)

1. **Build reel scrub and persona card expand are nearly undiscovered** (7 and 3 sessions). Either add interaction hints (e.g., hover states, animated indicators) or simplify the UX so the interactive nature is self-evident.
2. **Gajaakriti Studio is 3x more clicked than Royal Tiles Playground.** Reorder projects section by interest signal — put Gajaakriti Studio first. Consider adding more projects or featuring the most-clicked one higher.
3. **Instrument /making-of fully.** It's earning organic traffic. Add scroll_depth, section_view, and a contact CTA with proper tracking.
4. **The Atelier has zero funnel reach.** Consider surfacing a teaser or hint earlier in the scroll (before the astrolabe), or adding an alternative entry point (map jump, section link).

### P3 — Optimization

1. **Night and Day themes are nearly tied** — consider making Night the default (it's the #1 choice, slightly). Test whether a darker default increases time-on-site.
2. **Easter eggs (cow, scott, dwight) are found by very few.** Add an extremely subtle hint — one line of text, an unusual hover state — that signals "there are secrets here" without revealing them.
3. **Contact section reaching only 37% of visitors.** Add a floating/sticky CTA element that appears after 75% scroll to surface contact intent for deep scrollers who don't reach the bottom.
4. **Mobile (Android) converts at 2.78% vs macOS at 1.23%.** Mobile is not a dead channel — ensure the contact form is fully mobile-optimized with large tap targets and autofill support.

---

## Summary numbers for quick reference

| Metric | Last 24h | Last 30 days |
| --- | --- | --- |
| Unique visitors | 343 | ~358 (all concentrated Jun 29–Jul 1) |
| Sessions | 343 | ~358 |
| Avg session duration | 69s | 65.7s |
| Avg max scroll | 43.9% | 41.8% |
| Avg sections viewed | 3.81 | ~3.8 |
| Contact section reach | 33% | 36.6% |
| Form starts | — | 9 (2.51%) |
| Leads (contact_success) | 0 | 2 (0.56%) |
| Form abandonment | — | 78% |
| Form errors | 0 | 0 |
| Sound engagement | — | 309 heard, 16 muted |
| Theme switches | — | 309 total |
| Voice switcher opens | — | 33 |
| Voice selections | — | 25 total |
| Easter egg unlocks | — | 5 total |
| Reddit traffic share | 38% | — |
| Top inquiry type | — | Senior role (100%) |
| Keyboard shortcut users | — | 2 (power devs) |
