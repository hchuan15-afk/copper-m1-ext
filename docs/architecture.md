# Architecture

How the Copper State Labs app fits together. Each module adds a section at the
end (see [Adding a module](#adding-a-module)) when it changes how the app
works: new pages, tables or AI calls.

_Fictional — for educational use._

## The starter app (Module 0)

A Next.js app that builds, runs and deploys with **no environment variables**.
Supabase and the AI gateway are optional until a module needs them.

| Piece | Where | What it does |
|---|---|---|
| Pages | `app/` | `layout.tsx` sets the fonts and theme; `page.tsx` is the placeholder home page |
| Brand components | `components/copper/` | `Logo`, `SiteHeader`, `SiteFooter`, `ModeToggle` |
| UI kit | `components/ui/` (shadcn), `components/ai-elements/` (AI Elements) | The only UI libraries the app uses |
| Setup card | `components/setup-required.tsx` | `<SetupRequired service="supabase" \| "ai" />`, shown instead of a page whose service isn't configured |
| Company catalog | `lib/copper/catalog.ts`, `lib/copper/data/catalog.json` | Product, plan and privacy facts from the Product Bible (Sections 3, 4, 8 and 10). Pages read prices and plan details from here instead of typing them (added in the Module 1 starter) |
| Database helpers | `lib/supabase/` | `createClient()` for the server and the browser; returns `null` when Supabase isn't set up |
| AI wrapper | `lib/ai/call.ts` | `callText` and `callObject`: every model call goes through these and is logged to `ai_calls` |
| Models and prices | `lib/ai/models.ts`, `lib/ai/pricing.ts` | The approved models (Claude Haiku, Sonnet, Opus through the Vercel AI Gateway) and their token prices |
| Database | `supabase/migrations/`, `supabase/seed.sql` | Company tables from the Product Bible (Section 10) plus `ai_calls` |
| Module checks | `specs/module-N/`, `scripts/check.mjs` | Each module's spec, instructions, rubric and acceptance tests; `npm run check` runs them |

## Data flow

1. A user opens a page in `app/`.
2. Server code checks what's configured (`isSupabaseConfigured()`,
   `isAiConfigured()`). If something is missing, the page renders
   `<SetupRequired />` instead of crashing.
3. Data comes from Supabase through `lib/supabase/server.ts`.
4. AI requests go through `callText` / `callObject` in `lib/ai/call.ts`, which
   calls the model through the AI Gateway and then writes one row to `ai_calls`:
   `module`, `feature`, `model`, tokens, `cost_usd`, `latency_ms`, `ok`. Without
   Supabase, the row is logged to the console instead.

```ts
const { text } = await callText(
  { module: 2, feature: "review-radar" },
  { prompt },
);
```

## Two kinds of "AI tiers"

Don't mix these up:

- **Copper State Labs' product tiers** (On-device, Raw Ore, Refined, the
  Copper Cloud) are part of the fictional company. They are facts in the
  [Product Bible](copper-state-labs/product-bible.md) and rows in the `ai_tiers`
  table.
- **The models this app calls** are real Claude models listed in
  `lib/ai/models.ts`. Their cost is logged in `ai_calls`.

## Decisions

- **No environment variables required.** Every service is optional, so a fresh
  clone builds and deploys before any accounts are set up.
- **One AI wrapper.** Routing every call through `lib/ai/call.ts` gives one
  place to log cost and latency per module and feature.
- **No authentication or row-level security yet.** They arrive in a later
  module.

## Adding a module

When a module changes how the app fits together, add a section here:

```md
## Module N: <feature name>

**Summary:** one or two sentences: what this adds and why.

| Piece | Where | What it does |
|---|---|---|
| Page / route | `app/...` | |
| Components | `components/...` | |
| Data | `supabase/migrations/...` | Tables and columns added |
| AI calls | `lib/ai/call.ts` (module, feature) | Model, prompt purpose, expected cost per call |

**Data flow:** user action → page → server code → database / model → response.

**Decisions and trade-offs:** what you chose, the alternatives, and why.

**Risks and open questions:** cost, privacy, accuracy or safety risks, and how
you handle them.
```

## Module 1: Landing page (with copper-m1-ext extras)

**Summary:** `/` is a single static landing page that sells Copper Home and
Copper Notes, explains Copper Plus and the 2026 privacy policy. copper-m1-ext
adds a comparison table, a "which Copper" quiz, a Monthly/Yearly price switch,
an FAQ, a phone menu, a current-section highlight and a back-to-top button.

| Piece | Where | What it does |
|---|---|---|
| Page / route | `app/page.tsx` | The only route; composes the sections in order |
| Sections | `components/copper/{hero,products,compare,quiz-section,showcase,plus-pricing,privacy-summary,faq}.tsx` | Server components that read `lib/copper/catalog.ts` |
| Interactive pieces | `components/copper/{section-nav,plus-price-toggle,quiz,back-to-top}.tsx` | Client components: menu and scroll highlight, billing switch, quiz, back-to-top |
| Data | `lib/copper/catalog.ts` | Prices, plans, features, colors, privacy facts (read-only) |
| AI calls | none | |

**Data flow:** request → `app/page.tsx` (static, prerendered at build) → section
components read the catalog → HTML. Client components get catalog values as
props; nothing is sent back to a server.

**Decisions and trade-offs:** prices are always formatted from the catalog
(never typed), so a catalog change updates every section. Product Bible facts
the catalog doesn't hold (warranty, battery, "best for") live as small constants
next to the component that shows them. Only shadcn components already in
`components/ui` are used.

**Risks and open questions:** the FAQ and comparison table copy Product Bible
facts by hand, so they must be updated if the 2026 policies change. Only
customer-facing 2026 facts are used, never the old 2024 privacy policy or the
Marketing FAQ's "never records" error.
