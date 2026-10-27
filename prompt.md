# BUILD: "MeetingTax" — a viral meeting-waste calculator with a shareable 3D receipt card

Before writing any code, read and follow the `frontend-design` skill (and any other design skills available) so the result has a distinct, intentional look and does NOT read as a generic AI-generated landing page. Build the whole thing in one pass, then run it, fix errors, and check it at 375px, 768px and 1440px.

## 1. Product in one line
People feel meeting pain but have never seen the number. MeetingTax makes them see it: how much time and money they (or their company) burn on meetings that didn't need them, then gives them a beautiful 3D "Meeting Tax Receipt" card they want to post on LinkedIn and X.

## 2. Tech stack (fixed)
- React + Vite + TypeScript
- Tailwind CSS (custom theme tokens, no default palette)
- Three.js via @react-three/fiber + @react-three/drei for the 3D card
- Framer Motion for UI transitions, GSAP + ScrollTrigger for the landing page scroll storytelling
- html-to-image or a custom 2D canvas renderer for PNG export (see §7)
- No backend. No login. No data leaves the browser. State in React + URL params only.
- Fully responsive (mobile-first), respects `prefers-reduced-motion`, keyboard accessible, Lighthouse perf 90+ on mobile (lazy-load the 3D scene, cap DPR at 2, compress textures).

## 3. Design direction (anti-"AI-looking")
- Concept: a **corporate receipt / ledger / tax form** aesthetic with an editorial twist. Think thermal-receipt paper, stamped numbers, perforated edges, ink-on-paper contrast against a dark background with one hot accent color.
- Pick ONE bold, specific palette (for example: near-black ink, warm paper off-white, signal red-orange for "waste"). No purple-blue gradients, no glassmorphism blobs, no generic gradient hero, no emoji icons, no stock illustrations.
- Typography: pair an expressive display face (condensed grotesk or editorial serif, huge sizes) with a monospace for numbers/receipt text. Load from Google Fonts or Fontsource, with fallbacks. Numbers are always monospace and tabular.
- Layout: asymmetric, big type, generous whitespace, strong grid, hairline rules. Avoid the "three feature cards in a row" pattern.
- Motion: purposeful. Numbers count up, receipt "prints" line by line, stamp slams on the card. No random floating shapes.
- Tone of voice: blunt, dry, a little sarcastic, professional. Never cringe, never preachy.

## 4. Page flow

### Section A: Hero (full viewport)
- Giant headline, e.g. "Most of this meeting didn't need you." with a subline: "Usually 2 people decide. Everyone else watches the clock — and the company pays for it."
- A live animated counter ticking up in money as if a meeting is running ("This meeting has cost ₹ 0 → …"), reacting to currency choice.
- One primary CTA: "Show me my number" scrolls to Section C. Tiny secondary link: "See the stats".

### Section B: The pain (scroll storytelling with GSAP)
A pinned scroll sequence with 4–5 big-number stat beats. Data lives in `src/data/stats.ts` as `{ value, claim, source, url }`. Use REAL, citable statistics (e.g., from Harvard Business Review, Microsoft Work Trend Index, Atlassian, Bain, Doodle/Muse-type surveys). Do NOT invent numbers. If you are not certain a figure is accurate, put it in the file with `verified: false` and a `// TODO verify` comment, and list all unverified stats in your final message to me. Show the source as a small footnote under each stat.
Include one rhetorical beat that is clearly framed as an illustration, not a statistic: a room of 8 avatars where 2 light up ("needed") and 6 dim ("watching") with a running cost meter.

### Section C: "Who are you?" (the fork)
Two big, tactile choices: **I'm an Employee** / **I'm an Employer**. The choice changes the calculator, the copy, and the card.

#### Employee mode: "How much of your life goes to meetings?"
Inputs (sliders + steppers, big and thumb-friendly):
- Meetings per day (0–12)
- Average length in minutes (15/30/45/60/90 presets + custom)
- Honest slider: "How many of these did you truly need to attend?" (0–100%)
- Pay: annual salary OR monthly OR hourly (toggle). Optional and skippable; if skipped, show time-only results.
- Currency selector (INR default, USD, EUR, GBP, AED, SGD). Detect from locale, user can override.
- Working days per year (default 230)

Outputs:
- Minutes wasted per day → hours per week → hours per year → full workdays per year
- Money value of that wasted time per year (if pay was given)
- **Opportunity-cost translations** (the emotional hook). Make these data-driven in `src/data/opportunities.ts`, each with a required-hours figure and a label, e.g.: finish N online certifications, read N books, build N side-projects (at ~40 hrs each), N weeks of a full-time internship, N months of learning a language to conversational level, "invest that earned money monthly in an index fund and see the corpus after 10 years (clearly labelled as illustrative, show the assumed return as an editable assumption)". Show 3 translations on the card, chosen to be the most dramatic ones that are still honest.

#### Employer mode: "What are your meetings costing the company?"
Inputs:
- Number of attendees (1–50) and "how many actually needed to be there" (default 2)
- Average annual cost per attendee OR quick role presets (Engineer, Designer, PM, Manager, Director, Custom) with editable rates per currency
- Loaded-cost multiplier toggle (salary × 1.3 default, editable) with a one-line explainer
- Duration in minutes, optional prep + follow-up minutes
- Frequency: one-off / daily / weekly / biweekly / monthly

Outputs:
- Total cost of ONE meeting, cost per minute, cost per attendee
- **Wasted cost** = cost of the (attendees − needed) people's time
- Annualised cost if recurring, and annualised waste
- Equivalents: e.g. "= N junior hires per year", "= N team offsites", "= N months of a SaaS tool bill" (data-driven, region-aware, labelled illustrative)
- A blunt verdict engine (see §6)

### Section D: The reveal
On "Generate my receipt", transition into a dramatic moment: screen dims, receipt prints, then the 3D card enters (see §5).

### Section E: Share + tools
Download / share buttons, "Challenge a colleague" link, optional AI verdict panel (see §8), footer with methodology, assumptions, and sources.

## 5. The 3D card (hero feature)
- A physical-feeling card in a react-three-fiber scene: rounded corners, slight thickness, perforated receipt-style edge, subtle paper/foil material, soft shadows.
- Front face texture is rendered from an offscreen 2D canvas (so text stays crisp) and used as the card's map. Re-render it when inputs change.
- Interaction: drag to rotate with inertia, hover/pointer tilt on desktop, device-orientation tilt on mobile (ask permission properly on iOS), idle gentle float. A holographic/foil sheen (custom shader or MeshPhysicalMaterial with iridescence) that shifts with tilt.
- Entrance: card flies in, a rubber stamp ("WASTED" in Employee mode, "OVERBILLED" in Employer mode) slams on with a tiny screen shake and sound-free haptic (navigator.vibrate where supported).
- Back face: QR code or URL to the site + tagline + methodology one-liner.
- Reduced motion: fall back to a flat, static card with the same content.

### Card content (Employee example)
```
MEETINGTAX · RECEIPT No. 004281
-----------------------------------------
Name/handle (optional, editable)
Meetings/day ........... 5
Avg length ............. 30 min
Truly needed ........... 40%
-----------------------------------------
TIME WASTED / DAY ...... 90 min
TIME WASTED / YEAR ..... 345 hrs (43 workdays)
VALUE OF THAT TIME ..... ₹ 2,40,000
-----------------------------------------
IN THAT TIME YOU COULD HAVE:
 • Finished 8 certifications
 • Built 8 side projects
 • Done a 2-month internship
-----------------------------------------
VERDICT: "Half your week is a calendar invite."
meetingtax.app
```
(Adapt the layout; keep the receipt DNA. Use the user's currency formatting, with Indian digit grouping for INR via Intl.NumberFormat.)

## 6. Verdict engine
Pure function in `src/lib/verdict.ts`: takes the computed result and returns a headline + a suggested alternative. Tiers by waste ratio and cost, with several rotating copy variants per tier so repeat users get fresh lines. Examples of tone: "This is expensive. Consider an async update." / "Cancel it. Send the doc." / "Fine. Keep it short, keep it rare." Suggested alternatives: async doc, short Loom-style video, a Slack thread, "reduce attendees to the 2 who decide", "make it 15 minutes". Include a tier for "this meeting is actually reasonable" so it feels honest, not preachy.

## 7. Sharing (must be excellent)
- "Download PNG" produces three formats: 1200×630 (X/LinkedIn link-style), 1080×1350 (LinkedIn/Instagram portrait), 1080×1080. Render these with a dedicated 2D canvas renderer or html-to-image (NOT a screenshot of the WebGL canvas) so output is crisp at 2x.
- Web Share API with the image file on mobile; fallback to download.
- One-tap buttons: Share on X and Share on LinkedIn with prefilled, punchy copy that includes the user's number, e.g. "My meetings waste 345 hours a year. That's 43 workdays. Check yours →" plus the URL.
- Shareable URL that encodes the result via compact query params (e.g. `?m=employee&d=5&l=30&n=40&c=INR`) so opening it recreates the card. Do not encode salary in the URL by default; add an opt-in "include value in link" toggle.
- Add proper `<meta>` Open Graph/Twitter tags with a static default OG image, and leave a documented hook for dynamic per-result OG images later (note in README that dynamic OG needs a serverless function).
- "Copy link", "Copy caption" buttons.

## 8. Optional AI layer (build behind a feature flag, off by default)
"Should this have been an email?" panel: user pastes an agenda or notes, gets a blunt verdict plus a ready-to-send async version. Implement a small provider-agnostic `src/lib/ai.ts` that calls a user-supplied serverless endpoint set by `VITE_AI_ENDPOINT`. Never put API keys in the frontend. If the endpoint isn't set, the panel shows a disabled "coming soon" state. Include a short example serverless function in `/examples/ai-endpoint.md`.

## 9. Calculation rules (put all in `src/lib/calc.ts` with unit tests via Vitest)
- Employee yearly wasted minutes = meetingsPerDay × avgMinutes × (1 − neededPct) × workingDaysPerYear
- Hourly rate from annual = annual / (workingDaysPerYear × 8); from monthly = monthly × 12 / (workingDaysPerYear × 8)
- Employer waste = (attendees − needed) × (duration + prep + followup) / 60 × avgHourlyLoadedRate
- Annualisation by frequency: daily 230, weekly 48, biweekly 24, monthly 12, one-off 1
- All assumptions visible in a "How we calculate this" drawer. Every number on the card must be traceable to it.
- Validate inputs, clamp to sane ranges, never show NaN/Infinity.

## 10. Structure and quality
```
src/
  components/ (Hero, PainScroll, RoleFork, EmployeeForm, EmployerForm, ResultPanel, ReceiptCard3D, ShareBar, MethodologyDrawer)
  lib/ (calc.ts, verdict.ts, format.ts, share.ts, cardCanvas.ts, ai.ts)
  data/ (stats.ts, opportunities.ts, currencies.ts, rolePresets.ts)
  hooks/ (useReducedMotion, useDeviceTilt, useCountUp)
  styles/ (tokens in Tailwind config)
```
- Strict TypeScript, no `any`. Small components. Comments only where logic isn't obvious.
- Analytics-ready but off: add a single `track(event)` stub (events: role_selected, card_generated, share_clicked, download_clicked).
- README with run instructions, how to edit stats/opportunities/rates, and deploy notes (Vercel/Netlify).

## 11. Acceptance checklist (verify before you finish)
- [ ] Looks distinctive: no default Tailwind blue/purple, no generic gradient hero, no template-feeling card grid
- [ ] Both Employee and Employer flows work end to end and produce correct numbers (tests pass)
- [ ] 3D card renders on mobile Safari and Chrome, reduced-motion fallback works
- [ ] PNG exports are crisp in all three sizes and match the on-screen card
- [ ] Shared URL reproduces the same result
- [ ] 375px / 768px / 1440px layouts all clean, no horizontal scroll
- [ ] All stats have sources; unverified ones are listed in your final message
- [ ] Build passes with no console errors

When finished, summarize what you built, list every assumption you made, and list anything I should verify (especially statistics).