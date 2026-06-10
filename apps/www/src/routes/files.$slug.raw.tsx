import {createFileRoute, notFound} from '@tanstack/react-router';

// Streams the raw file bytes (used as the <img> source for image files).
// The loader runs server-side and re-streams from the API with the bearer token,
// matching how sitemap[.]xml.tsx emits a non-HTML response via `throw new Response(...)`.
export const Route = createFileRoute('/files/$slug/raw')({
  component: () => null,
  loader: async ({params}) => {
    const apiUrl = process.env.JOSHGRETZ_API_URL || 'http://localhost:3001';
    const apiToken = process.env.HELMET || '';

    const response = await fetch(`${apiUrl}/files/raw/${params.slug}`, {
      headers: {Authorization: `Bearer ${apiToken}`},
    });

    if (!response.ok) {
      if (response.status === 404) throw notFound();
      throw new Error(`Failed to load file: ${response.status}`);
    }

    throw new Response(await response.arrayBuffer(), {
      headers: {
        'Content-Type': response.headers.get('content-type') ?? 'application/octet-stream',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  },
});
