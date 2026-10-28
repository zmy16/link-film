<div align="center">

<img src="./app/icon.svg" width="76" height="76" alt="Golden Movie Hub" />

# Golden Movie Hub

**A directory of streaming sites — Indonesian and international — with Indonesian subtitles.**

One page. No pop-up ads. No player of our own. Pick a provider, watch.

![Next.js](https://img.shields.io/badge/Next.js-16.2.6-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19.2.3-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3.4.6-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-3.15-88CE02?style=flat-square&logo=greensock&logoColor=black)

[**www.link-film.eu.org**](https://www.link-film.eu.org)

</div>

---

## At a glance

| | |
|---|---|
| **What it is** | A single-page directory that links out to streaming sites |
| **What it is not** | A host, mirror, indexer, scraper, or player — no content is stored or streamed here |
| **Providers** | 7 across 2 regions (5 Indonesian, 2 international) |
| **Pages** | One route (`/`), statically prerendered, plus `robots.txt` and `sitemap.xml` |
| **Data source** | A single typed array in `lib/providers.ts` — no database, no CMS |
| **Rendering** | React Server Component shell + one client island (`ProviderDirectory`) |
| **Stack** | Next.js 16 App Router · React 19 · TypeScript 5.5 · Tailwind 3.4 |
| **Dev port** | `3100` by convention |

**Contents**

[Features](#features) · [Stack](#tech-stack) · [How it works](#how-it-works) · [Structure](#project-structure) · [Getting started](#getting-started) · [Adding a provider](#adding-a-provider) · [Design system](#design-system) · [SEO](#seo) · [Deployment](#deployment) · [Troubleshooting](#troubleshooting)

---

## Features

**Discovery**

- **Region tabs** — All / Indonesian / International, implemented as an ARIA tabs pattern
- **Live search** — matches name, tagline, kicker, and region label, debounced at 200 ms
- **Diacritic-tolerant matching** — `kitanonton`, `Kita Nonton`, and `KÍTA NÓNTON` all hit the same result
- **Rotating-domain resolution** — providers whose address changes are read server-side, so cards point at a URL that works today

**Presentation**

- **Per-region accent** — gold for Indonesian titles, teal for international
- **Quality badges** — HD / Full HD / 4K
- **Logo fallback** — a failed image degrades to a default icon instead of a broken box
- **Motion that respects `prefers-reduced-motion`** — entrance, count-up, and headline sweep all switch off
- **Custom 404**

**Foundations**

- **Zero layout shift** — self-hosted fonts via `next/font` with `display: swap`
- **Full SEO surface** — metadata, canonical, Open Graph, Twitter card, `robots.txt`, `sitemap.xml`
- **Vercel Analytics**, async-loaded

---

## Tech stack

| Concern | Choice | Why |
|---|---|---|
| Framework | **Next.js 16.2.6** (App Router, Turbopack) | Server components let domain resolution run at request time |
| UI | **React 19.2.3** | Ships with Next 16 |
| Language | **TypeScript 5.5.3**, `strict: true` | The provider shape is the contract |
| Styling | **Tailwind CSS 3.4.6** | Design tokens live in `tailwind.config.ts` |
| Animation | **GSAP 3.15** + `@gsap/react` | Precise stagger and timeline control beyond CSS keyframes |
| Type | **Sora** (display) + **Inter** (body) | Loaded via `next/font/google`, self-hosted at build |
| Icons | Hand-authored SVG | Full control of stroke width, no icon-library weight |
| Images | **sharp** | AVIF + WebP through the Next image optimizer |

> **Tailwind v3, not v4.** There is no `@theme` block and no `@tailwindcss/postcss`. Every token lives in `tailwind.config.ts` under `theme.extend`. Some notes in `docs/` were written assuming v4 and do not match the code.

---

## How it works

```
                      ┌─────────────────────────────────────┐
   lib/providers.ts ──▶  app/page.tsx  (Server Component)    │
   REGIONS + logos     │                                     │
                      │  await resolveLiveUrls(ids)         │──▶ lib/live-link.ts
                      │    ↳ fetch provider info pages      │    (6s timeout, 900s cache)
                      │                                     │
                      └───────────────┬─────────────────────┘
                                      │ liveUrls: Record<id, url>
                                      ▼
                      ┌─────────────────────────────────────┐
                      │  ProviderDirectory  ("use client")  │
                      │    region state · search · debounce │
                      │    ↳ ProviderCard × N               │
                      └─────────────────────────────────────┘
```

### Provider data — one source of truth

Everything lives in `lib/providers.ts`. `ProviderDirectory` holds no data; it only reads.

| Export | Purpose |
|---|---|
| `REGIONS` | The two real regions (`id`, `int`) with their `items` |
| `ALL_REGION` | Synthetic "All sites" region — the concatenation of both |
| `REGION_TABS` / `REGION_COUNTS` | Inputs for `RegionTabs` |
| `TOTAL_PROVIDERS` | Provider count, used by the hero statistics |
| `accentClasses()` | Maps an accent (`gold` / `teal`) to Tailwind class sets |
| `providerAccent()` | A card always wears its own region's accent, even in "All" |

### Rotating domains — `lib/live-link.ts`

Some providers have no stable domain. They publish a small "domain info" page that announces today's address, and it changes every few weeks. Linking to that page costs the visitor two clicks; the second one is the one that moves.

`resolveLiveUrls()` reads the info page **on the server** (`app/page.tsx`, `revalidate = 900`) and extracts the single anchor that means "watch films". Social links, the anime portal, and bookmark links are deliberately ignored.

**Failure is never fatal.** On timeout, garbage markup, or no matching anchor, the provider keeps its fallback `url` — which is the info page itself: still correct, merely one click longer.

Only `ngefilm21` and `pusatfilm` have rules today. A provider without a rule is never fetched.

### Search — `lib/normalize.ts`

The same normalization runs on the query and on every searched field:

```
NFD → strip combining marks → lowercase → keep [a-z0-9]
```

Input is truncated to `MAX_QUERY_LENGTH` (100 characters) before processing.

### Server / client boundary

Only `ProviderDirectory` is a client component (it needs state for the search box and tabs). Everything above it — layout, header, hero, footer, domain resolution — stays on the server.

---

## Project structure

```
link-film/
├── app/
│   ├── layout.tsx              # Root layout · metadata · font loaders
│   ├── page.tsx                # Server shell · resolves live URLs
│   ├── not-found.tsx           # Custom 404
│   ├── globals.css             # CSS variables, @layer components/utilities
│   ├── robots.ts               # → /robots.txt
│   ├── sitemap.ts              # → /sitemap.xml
│   ├── icon.svg                # Favicon
│   └── opengraph-image.png     # 1200×630 social card
│
├── components/
│   ├── Header.tsx              # Sticky brand bar + scroll progress
│   ├── Hero.tsx                # Headline, blurb, statistics
│   ├── ProviderDirectory.tsx   # ★ client island: region state, search, stagger
│   ├── ProviderCard.tsx        # Poster card (4:5)
│   ├── RegionTabs.tsx          # ARIA tabs
│   ├── SearchBar.tsx
│   ├── EmptyState.tsx
│   ├── Footer.tsx
│   ├── Logo.tsx                # Clapperboard mark
│   ├── Icons.tsx               # Line-art icon set
│   ├── ScrollProgress.tsx
│   └── motion/
│       ├── MotionFx.tsx        # Aurora
│       └── MotionText.tsx      # CountUp · GradientText · SplitText
│
├── lib/
│   ├── providers.ts            # ★ source of truth for all provider data
│   ├── live-link.ts            # Server-only rotating-domain resolution
│   └── normalize.ts            # Search normalization
│
├── public/logos/               # 7 provider logos (PNG)
├── docs/                       # Requirements, design, design decisions
├── scripts/count-components.mjs
├── AGENTS.md                   # Handover guide for AI/agent contributors
└── tailwind.config.ts · next.config.mjs · tsconfig.json
```

---

## Getting started

**Requirements:** Node.js 18.17+ and npm.

```bash
git clone https://github.com/zmy16/link-film.git
cd link-film
npm install
npm run dev
```

Open <http://localhost:3000>. This project is normally run on port 3100:

```bash
npm run dev -- -p 3100
```

| Command | Purpose |
|---|---|
| `npm run dev` | Dev server with Turbopack hot reload |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ⚠️ **Broken** — `eslint` is not in `devDependencies`. Use `npx tsc --noEmit` as the gate. |

> **Do not run `npm run build` while the dev server is running.** Both write to `.next/` and the dev server breaks. For a fast correctness check, `npx tsc --noEmit` is enough.

---

## Adding a provider

### 1 · Prepare the logo

Place a **1000×1000 PNG** in `public/logos/`, transparent unless the mark is designed solid.

Then import it:

```ts
import exampleLogo from "@/public/logos/example.png";
```

If a logo renders as a blurred rectangle, the image optimizer is hanging on its Turbopack-hashed filename. Reference it by public path instead — `logo: "/logos/example.png"` — and see the `dutafilmLogo` comment in `lib/providers.ts` for the full explanation.

### 2 · Add the entry

```ts
{
  id: "example",                        // stable slug, used as the React key
  name: "Example",
  tagline: "One line, at most two.",
  quality: "HD",                        // "HD" | "Full HD" | "4K"
  url: "https://example.com/",
  kicker: "FILM & SERIES",              // short label above the name
  logo: exampleLogo,
  region: "id",                         // "id" | "int"
}
```

Provider counts on the hero and the tabs update themselves — nothing else to edit.

### 3 · If the domain rotates

Add `liveInfoUrl` and a matching rule in `RULES` (`lib/live-link.ts`):

```ts
liveInfoUrl: "https://example.com/info"
```

```ts
const RULES: Record<string, Rule> = {
  example: {
    infoPage: "https://example.com/info",
    prefer: /watch\s+film/i,               // anchor text that means "go here"
    deny: /anime|telegram|t\.me|whatsapp/i, // never pick these
  },
};
```

Without a rule the provider is never fetched and keeps its static `url`.

### 4 · A new region

Add an object to `REGIONS` with an `accent` of `gold` or `teal`. A brand-new accent also needs a branch in `accentClasses()`.

---

## Design system

Tokens are defined once in `tailwind.config.ts`.

### Color

| Token | Hex | Use |
|---|---|---|
| `base` | `#08080A` | Page background |
| `elevated` | `#101013` | Provider card |
| `surface` | `#16161A` | Container |
| `surface-2` | `#1E1E24` | Raised layer |
| `line` | `#2A2A31` | 1px border |
| `line-strong` | `#3A3A44` | Emphasised border |
| `ink` | `#F2F2F4` | Primary text |
| `ink-soft` | `#B4B4BC` | Secondary text |
| `muted` | `#8A8A95` | Metadata |
| `gold` | `#FFD700` | Indonesian accent |
| `teal` | `#2DD4BF` | International accent |
| `on-accent` | `#08080A` | Text on a saturated accent fill |

> **Never swap `on-accent` for `base`.** Tailwind also ships a font-size utility named `text-base`. Once `base` is a color, the class `text-base` emits **both** a color and a size/line-height — which once inflated the active tab to 44px instead of 35px because the count badge inherited the 24px line-height. The separate token exists to prevent that.

### Typography

| Utility | Family | Variable |
|---|---|---|
| `font-display` | Sora | `--font-display` |
| `font-sans` | Inter | `--font-body` |

### Motion

- Easing: `ease-cine` = `cubic-bezier(0.16, 1, 0.3, 1)`
- Animations: `animate-rise` (0.55s), `animate-breathe` (2.4s)
- Every one of them is disabled under `prefers-reduced-motion: reduce`

### Layout rule

`app/globals.css` sets `overflow-x: clip` on `html, body` — **not `hidden`**. `overflow-x: hidden` turns the body into a scroll container, which stops the sticky header from sticking. Do not change it.

---

## SEO

| File | Role |
|---|---|
| `app/layout.tsx` | `metadataBase`, title, description, canonical, Open Graph, Twitter card, `robots: index/follow` |
| `app/robots.ts` | Emits `/robots.txt`, allows all crawlers, points at the sitemap |
| `app/sitemap.ts` | Emits `/sitemap.xml`, `changeFrequency: daily` |
| `app/opengraph-image.png` | 1200×630 social card |
| `app/icon.svg` | Favicon |

**The domain appears in three places.** Changing it means changing all three:

1. `app/layout.tsx` → `metadataBase` and `openGraph.url`
2. `app/robots.ts` → `sitemap`
3. `app/sitemap.ts` → `url`

One production step cannot be done from this repo: register the site in **Google Search Console** and submit `https://www.link-film.eu.org/sitemap.xml`.

---

## Deployment

**Vercel (recommended)**

1. Push the repo to GitHub
2. [vercel.com](https://vercel.com) → sign in with GitHub
3. **Add New → Project** → pick the repo → **Deploy**

Set the final domain in the three places listed under [SEO](#seo) first.

**Alternatives**

- **Netlify** or **Cloudflare Pages** — work without extra configuration
- **GitHub Pages** — needs `output: 'export'` in `next.config.mjs`. Note that `lib/live-link.ts` fetches at request time, so a static export changes its behaviour.

---

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| A logo shows as a blurred box | Image optimizer hangs on the Turbopack-hashed filename at `w=640` | Reference the logo by `public/` path, not a static import |
| Dev server breaks after a build | `next build` and `next dev` share `.next/` | Never build while dev is running |
| `npm run lint` fails | `eslint` is not installed | Use `npx tsc --noEmit` |
| Sticky header stops sticking | `overflow-x: hidden` on `body` | Use `overflow-x: clip` |
| `text-base` looks oversized | Color token and font-size utility collide | Use `text-on-accent` |
| "Multiple lockfiles detected" warning | Nested worktrees carry their own lockfile | `turbopack.root` is already pinned in `next.config.mjs` |

---

## Known limitations

- **`npm run lint` does not work** — `eslint` is missing from `devDependencies`, though the script is defined.
- **Brand and domain disagree** — the UI says "Golden Movie Hub"; the repo and domain say `link-film`. `package.json` is still named `golden-movie-hub`.
- **No `LICENSE` file** exists in this repository.
- **Documentation drift** — parts of `docs/` were written against a Tailwind v4 assumption that the code does not follow.

---

## Contributing

Read **`AGENTS.md`** before changing anything — it lists the hard rules this codebase depends on, and the traps that have already caused bugs once.

---

## Credits

- [Sora](https://fonts.google.com/specimen/Sora) and [Inter](https://rsms.me/inter/) by Rasmus Andersson
- [Next.js](https://nextjs.org/) by Vercel
- [GSAP](https://gsap.com/)

---

<div align="center">

**A link directory. All content stays on each provider's own site — never here.**

</div>
