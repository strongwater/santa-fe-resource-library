# Santa Fe Urban Planning Resource Library

A research library supporting Santa Fe's General Plan update (Santa Fe
Forward) and the Land Development Code Update Phase II: peer-city
General Plan reforms, plan language comparisons, affordable housing
incentive programs, land development code concepts, historic
preservation approaches, and a source-document library.

This is an [Astro](https://astro.build) rebuild of a single-file HTML
artifact that had grown to ~580KB and become hard to maintain. See
`MIGRATION_GUIDE.md` for exactly how the old site's SPA router and
page IDs map onto this site's URLs — read that before touching any
internal link.

## Project structure

```
src/
  content/
    cities/            one Markdown file per city/state profile (29 total)
  content.config.ts    schema for the "cities" content collection
  components/
    Sidebar.astro       site navigation
    SantaFeComparison.astro   shared "For comparison, Santa Fe: ..." line
  layouts/
    BaseLayout.astro    page shell: head, fonts, sidebar, mobile nav toggle
  lib/
    santaFeStats.ts     Santa Fe's own stats, used by SantaFeComparison
  pages/
    index.astro                          Home
    recommendations/index.astro          Recommendations
    local/
      santa-fe-today/index.astro         Where the Updates Stand (GP & LDC process status)
      nm-housing-policy/index.astro      New Mexico & Local Housing Policy
    research/
      general-plan-reforms/index.astro   Effective General Plan Reforms
      plan-language/index.astro          General Plan Language Comparisons
      housing-incentives/index.astro     Affordable Housing Incentives
      ldc-concepts/index.astro           Land Development Code Concepts
      historic-preservation/index.astro  Historic Preservation Approaches
    cities/
      index.astro         By City (sortable comparison table)
      [slug].astro         individual city/state profile (dynamic route)
    states/index.astro    By State
    pdf-library/index.astro   PDF Library (with the title/source filter)
  styles/
    global.css           shared design system (fonts, colors, every
                          component class used across pages)
```

## Adding or editing a city profile

Each file in `src/content/cities/*.md` has frontmatter for the
structured bits (name, kicker, page subtitle, the "Why X is in this
library" callout, cross-reference links, and the Snapshot stat grid)
and a Markdown body for the variable part — the sequence of
`section.sub` blocks with their cards, quotes, and source links,
written as plain HTML reusing classes already defined in
`global.css` (`.card-grid`, `.card`, `.stat-row`, `.quote-stack`,
`.src-row`, `.link-box`, etc. — copy the pattern from an existing
profile rather than inventing new markup).

To add a new city:
1. Copy an existing file in `src/content/cities/` as a starting point.
2. Fill in the frontmatter fields (see `src/content.config.ts` for the
   exact schema).
3. Write the body as HTML, linking to other pages with real paths
   (`/cities/<slug>/`, `/research/<page>/`, etc. — see
   `MIGRATION_GUIDE.md`'s routing table), not the old `data-target`
   attributes.
4. If the city should show the standard Santa Fe comparison line, set
   `showSantaFeComparison: true` (the default) — do not paste that
   paragraph into the body; it comes from the shared
   `<SantaFeComparison />` component.
5. Add it to the sidebar count in `src/components/Sidebar.astro` and
   to the comparison table in `src/pages/cities/index.astro` if it
   should appear there.

## Local development

This project was built in a sandbox with no access to npm's registry,
so `npm install` has never actually been run against it. On a machine
with normal internet access:

```
npm install
npm run dev       # local dev server
npm run build     # production build -> dist/
npm run preview   # serve the production build locally
```

The first real build-correctness check happens on Cloudflare Pages
once this repo is connected there (see below) — treat that build log,
not a visual read of the source, as the actual verification.

## Deploying to Cloudflare Pages

1. In the Cloudflare dashboard: **Workers & Pages → Create → Pages →
   Connect to Git**, and select this repository.
2. Build settings:
   - **Framework preset:** Astro
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
3. No environment variables or SSR adapter are needed — this is a
   fully static site (`astro.config.mjs` sets `output: 'static'`).
4. Every push to `main` triggers a new deployment; pull requests get
   preview deployments automatically.

## What's intentionally different from the original site

- **Real URLs, not a hash router.** Every page is its own route;
  there is no client-side router, no `localStorage`-remembered last
  page, and no `popstate` handling — see `MIGRATION_GUIDE.md`.
- **No duplicated Santa Fe stats.** The ~20KB "For comparison, Santa
  Fe: population 89,837…" paragraph that was pasted into 26 separate
  city templates now lives once, in `src/lib/santaFeStats.ts`.
- **Dead CSS removed.** A leftover "Street Typologies" page had been
  removed from the live site at some point, but its CSS (corridor
  tabs, street-section diagrams) stayed in the stylesheet. It's gone
  from `global.css` — confirmed zero HTML in the live site referenced
  those classes before removing them.
- **Interactive widgets are scoped `<script>` tags**, not a single
  global script with event delegation: the PDF Library filter and the
  By City sortable table each carry their own small script in their
  own page, since Astro's real routing means there's no SPA lifecycle
  to delegate clicks across anymore.
