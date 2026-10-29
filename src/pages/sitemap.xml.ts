import { projects } from '../data/projects';
import { site } from '../data/site';
export function GET() {
  const paths = ['/', '/about/', '/projects/', '/skills/', '/education/', '/contact/', ...projects.map((p) => `/projects/${p.slug}/`)];
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths
    .map((p) => `  <url><loc>${new URL(p, site.url).href}</loc><lastmod>${site.buildDate}</lastmod></url>`)
    .join('\n')}\n</urlset>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
}
