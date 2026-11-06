# Migration guide: SPA hash-router → Astro routes

The original single-file site (published as the "Santa Fe Urban Planning
Resource Library" Artifact) is a client-side SPA: one HTML document, one
`<script>` router, and `data-target="<id>"` / `data-anchor="<id>"`
attributes standing in for real links. Astro gives us real URLs and real
`<a href>` links, so every internal link in migrated content must be
rewritten using the table below — do not carry over
`data-target`/`data-anchor`/`onclick` attributes into the new site.

## Page ID → URL

| Old `data-target` / page id | New URL |
|---|---|
| `home` | `/` |
| `recommendations` | `/recommendations/` |
| `scan` | `/research/general-plan-reforms/` |
| `guide` | `/research/plan-language/` |
| `incentives` | `/research/housing-incentives/` |
| `ldc` | `/research/ldc-concepts/` |
| `historic` | `/research/historic-preservation/` |
| `bycity` | `/cities/` |
| `bystate` | `/states/` |
| `pdfs` | `/pdf-library/` |
| `city:<slug>` | `/cities/<slug>/` |

## Rewriting old links

Old (SPA):
```html
<a href="#" data-target="scan">Effective General Plan Reforms</a>
<a href="#" data-target="scan" data-anchor="pcs-minneapolis">Minneapolis</a>
<button data-scrollto="rec-scan">General Plan Reforms</button>
```

New (Astro):
```html
<a href="/research/general-plan-reforms/">Effective General Plan Reforms</a>
<a href="/research/general-plan-reforms/#pcs-minneapolis">Minneapolis</a>
<a href="#rec-scan">General Plan Reforms</a>
```

Rules:
- `data-target="X"` → `href` from the table above.
- `data-target="X" data-anchor="Y"` → `href="<url for X>#Y"` (the anchor
  IDs on section/card elements are unchanged — keep every `id="..."` as-is
  when migrating a page's body).
- `data-scrollto="Y"` (in-page jump nav, e.g. the `<nav class="jump">`
  bar) → plain `href="#Y"`. These never had `preventDefault()` in the old
  router, so a plain anchor link reproduces the old behavior exactly.
- City template references embedded in prose (`city-tpl-<slug>`) →
  `/cities/<slug>/`.

## Removed entirely

- The whole `<script>` router (`showPage`, `setActiveNav`, `scrollToAnchor`,
  `popstate` handling, `localStorage.getItem('sfrl_last_page')`,
  `history.pushState`). Real routes replace all of it.
- `<section class="page" data-page="...">` wrappers → each becomes its own
  `.astro` file under `src/pages/...`, rendered unconditionally (there is
  no more "inactive" state to hide).
- `<template id="city-tpl-...">` wrappers around city profiles → each
  becomes one Markdown file in `src/content/cities/`, rendered through the
  single `src/pages/cities/[slug].astro` dynamic route.

## Kept as-is (still needed, now scoped per-component)

- `nav.jump` (in-page section jump bar) — kept, links become `#id` anchors
  per the rule above.
- The PDF Library filter widget, sortable comparison tables, and mobile
  sidebar toggle — reimplemented as small scoped `<script>` blocks living
  in the relevant `.astro` component. Behavior is preserved; only how the
  script is loaded changes (Astro requires no framework — plain `<script>`
  inside a component works the same way it did in the single-file site).

## Content-authoring format for city/state profiles

Plain Markdown (`.md`) content collection entries, **not** MDX. Astro's
default Markdown pipeline renders raw HTML embedded in a `.md` body as
real HTML (this is the standard `.md` behavior, not a config flag) —
MDX was considered and rejected because MDX requires JSX-style component
syntax and does not support raw HTML tags in the body, which would force
a rewrite of every card/quote/snapshot block instead of a close-to-verbatim
migration.

Structured, reusable fields (name, kicker, type, snapshot stats,
cross-refs, source links) go in frontmatter, validated by the schema in
`src/content.config.ts`. The variable part — the sequence of `section.sub`
blocks with their card grids, quote stacks, and "Borrow" callouts — stays
as raw HTML in the Markdown body, reusing the exact class names already
defined in `src/styles/global.css` (`.card-grid`, `.card`, `.stat-row`,
`.quote-stack`, `.src-row`, etc.) so no new CSS is needed.

The one required change to body content: the "For comparison, Santa Fe:
population 89,837…" paragraph that was duplicated verbatim in every city
profile is **not** copied into each Markdown file. It is rendered once,
from a single shared data object (`src/lib/santaFeStats.ts`), by a shared
`<SantaFeComparison />` component that every city page includes
automatically.

## Build/verification constraint

This repository was hand-authored in a sandbox that cannot reach npm's
registry, so `npm install` / `npm run build` have never been run locally.
The first real build happens on Cloudflare Pages once this repo is
connected there — check that build log for the actual pass/fail signal,
not just "the files look right."
