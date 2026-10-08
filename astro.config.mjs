// miguel-adan.com: a static site. `npm run build` writes it to dist/, which scripts/deploy.py publishes to Cloudflare Pages.
//   /         English page   (src/pages/index.astro)
//   /es/      Spanish page   (src/pages/es/index.astro)
//   /mads/    MA Design System reference, from the @maadan/mads package (src/pages/mads/index.astro)
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://miguel-adan.com',
});
