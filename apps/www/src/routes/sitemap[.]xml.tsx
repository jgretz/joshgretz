import {createFileRoute} from '@tanstack/react-router';

const BASE_URL = 'https://joshgretz.com';

const STATIC_PAGES = ['/', '/resume', '/readme', '/thoughts', '/running'];

type ThoughtSlug = {slug: string; published_at: string | null};

function generateSitemapXml(thoughts: ThoughtSlug[]): string {
  const urls = [
    ...STATIC_PAGES.map((path) => ({
      loc: `${BASE_URL}${path}`,
      lastmod: undefined as string | undefined,
      changefreq: 'weekly',
      priority: path === '/' ? '1.0' : '0.8',
    })),
    ...thoughts.map((thought) => ({
      loc: `${BASE_URL}/thoughts/${thought.slug}`,
      lastmod: thought.published_at
        ? new Date(thought.published_at).toISOString().split('T')[0]
        : undefined,
      changefreq: 'monthly',
      priority: '0.6',
    })),
  ];

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map(
      (url) =>
        `  <url>\n    <loc>${url.loc}</loc>${
          url.lastmod ? `\n    <lastmod>${url.lastmod}</lastmod>` : ''
        }\n    <changefreq>${url.changefreq}</changefreq>\n    <priority>${
          url.priority
        }</priority>\n  </url>`,
    ),
    '</urlset>',
  ].join('\n');
}

export const Route = createFileRoute('/sitemap.xml')({
  component: () => null,
  loader: async () => {
    const apiUrl = process.env.JOSHGRETZ_API_URL || 'http://localhost:3001';
    const apiToken = process.env.HELMET || '';

    let thoughts: ThoughtSlug[] = [];
    try {
      const response = await fetch(`${apiUrl}/thoughts/published`, {
        headers: {Authorization: `Bearer ${apiToken}`},
      });
      if (response.ok) {
        thoughts = (await response.json()) as ThoughtSlug[];
      }
    } catch {
      // Static pages only if API unavailable
    }

    throw new Response(generateSitemapXml(thoughts), {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  },
});
