// Sitemap generation for SEO

export interface SitemapEntry {
  url: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export function generateSitemap(entries: SitemapEntry[]): string {
  const baseUrl = process.env.SITE_URL || 'https://learnconnect.net';
  
  const xmlEntries = entries.map(entry => `  <url>
    <loc>${baseUrl}${entry.url}</loc>
    ${entry.lastmod ? `<lastmod>${entry.lastmod}</lastmod>` : ''}
    ${entry.changefreq ? `<changefreq>${entry.changefreq}</changefreq>` : ''}
    ${entry.priority ? `<priority>${entry.priority}</priority>` : ''}
  </url>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlEntries}
</urlset>`;
}

export const defaultSitemapEntries: SitemapEntry[] = [
  { url: '/', changefreq: 'daily', priority: 1.0 },
  { url: '/auth', changefreq: 'monthly', priority: 0.8 },
  { url: '/courses', changefreq: 'daily', priority: 0.9 },
  { url: '/entrance-exam-prep', changefreq: 'weekly', priority: 0.9 },
  { url: '/tyt-dashboard', changefreq: 'daily', priority: 0.8 },
  { url: '/my-curriculum', changefreq: 'daily', priority: 0.8 },
  { url: '/study-planner', changefreq: 'daily', priority: 0.7 },
  { url: '/ai-daily-plan', changefreq: 'daily', priority: 0.7 },
  { url: '/profile', changefreq: 'weekly', priority: 0.6 },
  { url: '/subscription', changefreq: 'monthly', priority: 0.7 },
];
