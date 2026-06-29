import {Elysia, t} from 'elysia';
import {findFileBySlug} from 'files';

// Strip bytes that would break a quoted Content-Disposition filename: control
// chars (incl. CR/LF) and DEL, plus double quotes and backslashes.
const UNSAFE_FILENAME_CHARS = new RegExp('[\\x00-\\x1f\\x7f"\\\\]', 'g');

// Build a Content-Disposition: attachment header from an arbitrary filename.
// Provides a sanitized ASCII `filename="..."` plus an RFC 5987 `filename*`
// form so non-ASCII names survive intact.
function attachmentDisposition(filename: string): string {
  const ascii = filename.replace(UNSAFE_FILENAME_CHARS, '');
  const encoded = encodeURIComponent(filename);
  return `attachment; filename="${ascii}"; filename*=UTF-8''${encoded}`;
}

// Public (unauthenticated) raw file bytes. Uploaded files are shareable by URL,
// so this route lives OUTSIDE the bearer guard and is consumed directly as an
// <img> source by the public /files/{slug} page. The ?download flag adds a
// Content-Disposition header so cross-origin anchors reliably save the file
// (the HTML download attribute is ignored across origins).
export default new Elysia({prefix: '/files'}).get(
  '/raw/:slug',
  async ({params: {slug}, query: {download}}) => {
    const file = await findFileBySlug(slug);
    if (!file) {
      return new Response('Not found', {status: 404});
    }
    const headers: Record<string, string> = {
      'Content-Type': file.mime_type,
      'Cache-Control': 'public, max-age=3600',
    };
    if (download) {
      headers['Content-Disposition'] = attachmentDisposition(file.original_filename);
    }
    return new Response(file.data, {headers});
  },
  {
    params: t.Object({slug: t.String()}),
    query: t.Object({download: t.Optional(t.String())}),
  },
);
