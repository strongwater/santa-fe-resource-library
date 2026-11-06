import { defineConfig } from 'astro/config';

// Static site, no SSR adapter needed — Cloudflare Pages serves the
// prerendered `dist/` output directly (build command: `npm run build`,
// output directory: `dist`).
export default defineConfig({
  site: 'https://santa-fe-resource-library.pages.dev',
  output: 'static',
  trailingSlash: 'always',
});
