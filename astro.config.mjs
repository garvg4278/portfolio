import { defineConfig } from 'astro/config';

// Static output: the build is served by nginx (see Dockerfile / nginx.conf).
// `site` comes from PUBLIC_SITE_URL so the sitemap and canonical URLs follow the deployment (see .env.example).
const site = process.env.PUBLIC_SITE_URL || 'https://garv-gupta-portfolio.bytexl.live';

export default defineConfig({
  site,
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  devToolbar: { enabled: false },
  vite: { build: { chunkSizeWarningLimit: 600 } },
});
