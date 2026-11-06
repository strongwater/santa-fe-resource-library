import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// City & state profiles — see MIGRATION_GUIDE.md for the authoring format
// decision (plain Markdown with raw-HTML body, not MDX).
//
// Structured/reusable fields live in frontmatter; everything from "THE
// ZONING REFORM" section onward (the variable card/quote/source content)
// is the Markdown body, written as raw HTML reusing classes already
// defined in src/styles/global.css.
const cities = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/cities' }),
  schema: z.object({
    // e.g. "Minneapolis", "California", "Santa Fe"
    name: z.string(),
    // e.g. "Flagship Reform · Minnesota"
    kicker: z.string(),
    // the page-sub line under the title
    pageSub: z.string(),
    // in-page cross-reference links shown under the header
    // (old data-target/data-anchor pairs — see MIGRATION_GUIDE.md)
    xrefs: z
      .array(
        z.object({
          label: z.string(),
          href: z.string(),
        }),
      )
      .default([]),
    // the Snapshot stat grid (population, density, etc.) — value/note may
    // contain simple inline HTML (e.g. an <span class="aff-badge">)
    snapshot: z
      .array(
        z.object({
          label: z.string(),
          value: z.string(),
          note: z.string().optional(),
          valueStyle: z.string().optional(),
        }),
      )
      .default([]),
    // Show the shared <SantaFeComparison /> line under the snapshot.
    // False for Santa Fe's own profile and the two state-level profiles.
    showSantaFeComparison: z.boolean().default(true),
  }),
});

export const collections = { cities };
