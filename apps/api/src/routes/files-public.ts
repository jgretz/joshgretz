import {Elysia, t} from 'elysia';
import {findFileBySlug} from 'files';

// Public (unauthenticated) raw file bytes. Uploaded files are shareable by URL,
// so this route lives OUTSIDE the bearer guard and is consumed directly as an
// <img> source by the public /files/{slug} page.
export default new Elysia({prefix: '/files'}).get(
  '/raw/:slug',
  async ({params: {slug}}) => {
    const file = await findFileBySlug(slug);
    if (!file) {
      return new Response('Not found', {status: 404});
    }
    return new Response(file.data, {
      headers: {
        'Content-Type': file.mime_type,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  },
  {params: t.Object({slug: t.String()})},
);
