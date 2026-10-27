# MeetingTax 🧾

> **The viral meeting-waste calculator with a physical-feeling 3D receipt card.**
> *Most of this meeting didn't need you. Calculate the real money and hours burned on calendar clutter.*

---

## ⚡ Quickstart

```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev

# 3. Run calculation tests (Vitest)
npm test

# 4. Create production bundle
npm run build
```

---

## 🧱 Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with a custom editorial corporate ledger theme (obsidian `#090A0C`, warm thermal paper `#F5EFEB`, electric waste `#FF3B1E`, tabular typography)
- **3D Interactive Card**: [Three.js](https://threejs.org/) via [@react-three/fiber](https://r3f.docs.pmnd.rs/) + [@react-three/drei](https://github.com/pmndrs/drei)
- **Storytelling Motion**: [GSAP](https://gsap.com/) + ScrollTrigger
- **Social Export**: Dedicated 2D canvas generator producing crisp 2× high-DPI images for X/LinkedIn (1200×630), Instagram Portrait (1080×1350), and Square (1080×1080)
- **Unit Testing**: [Vitest](https://vitest.dev/)
- **Privacy & Telemetry**: 100% client-side. Zero trackers, zero cookies, no salary data leaves the browser. State is retained in React state and compact shareable URL parameters.

---

## 🎛️ How to Customize Data & Benchmarks

All content and benchmarks are strictly decoupled into `src/data/`:

| Data File | Purpose | What to Edit |
| :--- | :--- | :--- |
| `src/data/stats.ts` | Section B citable statistics | Add or update real empirical stats from HBR, Microsoft 365, Bain, and Atlassian. Flag unverified numbers with `verified: false`. |
| `src/data/opportunities.ts` | Emotional opportunity cost translations | Edit hours required for certifications, side project MVPs, book reading, language learning, or 10-year index fund compounding returns. |
| `src/data/rolePresets.ts` | Employer mode role benchmarks | Adjust default annual salaries for Engineers, Designers, PMs, Managers, and Directors across currencies. |
| `src/data/currencies.ts` | Multi-currency support | Configure symbols, Intl locales, typical regional salary benchmarks, and default index return rates for INR, USD, EUR, GBP, AED, SGD. |
| `src/lib/verdict.ts` | The blunt verdict engine | Add or customize rotating dry, sarcastic verdicts, rubber stamp titles, and suggested alternatives. |

---

## 📐 Calculation Rules & Methodology

1. **Employee Mode**:
   $$\text{Daily Minutes Lost} = \text{Meetings/Day} \times \text{Avg Duration} \times (1 - \text{Needed\%})$$
   $$\text{Yearly Hours Lost} = \frac{\text{Daily Minutes Lost} \times \text{Working Days}}{60}$$
   $$\text{Salary Squandered} = \text{Yearly Hours Lost} \times \left( \frac{\text{Annual Salary}}{\text{Working Days} \times 8} \right)$$
   *Default Working Days*: **230 days** (260 weekdays − 20 vacation/PTO days − 10 public holidays).

2. **Employer Mode**:
   $$\text{Hourly Loaded Rate} = \left(\frac{\text{Salary}}{\text{Working Days} \times 8}\right) \times \text{Loaded Multiplier (1.3×)}$$
   $$\text{Cost Per Meeting} = \text{Attendees} \times \left(\frac{\text{Duration} + \text{Prep}}{60}\right) \times \text{Hourly Loaded Rate}$$
   $$\text{Annualized Waste} = (\text{Attendees} - \text{Needed}) \times \left(\frac{\text{Duration} + \text{Prep}}{60}\right) \times \text{Hourly Loaded Rate} \times \text{Frequency Multiplier}$$

3. **10-Year Index Compounding (Future Value of Monthly Contributions)**:
   $$FV = P \times \left[ \frac{(1 + r/12)^{120} - 1}{r/12} \right]$$

---

## 🤖 Optional AI Agenda Auditor (`VITE_AI_ENDPOINT`)

The "Should this have been an email?" auditor connects to a user-supplied serverless endpoint.
To enable it:
1. Create a serverless function (see `/examples/ai-endpoint.md`).
2. Add the endpoint URL to your `.env.local`:
   ```bash
   VITE_AI_ENDPOINT=https://your-domain.com/api/analyze-agenda
   ```
*(When no endpoint is set, the panel gracefully displays a clean "coming soon" indicator without exposing any frontend secrets).*

---

## 🚀 Deployment

### Deploy on Vercel
```bash
npx vercel
```
*Build Command*: `npm run build`  
*Output Directory*: `dist`

### Deploy on Netlify
```bash
npx netlify deploy --prod
```
*Publish Directory*: `dist`

---

## 📄 License
MIT License. Built for teams and individuals reclaiming their focus.
