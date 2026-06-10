import {Elysia, t} from 'elysia';
import {
  createFile,
  deleteFile,
  deleteFilesOlderThan,
  findAllFiles,
  findFileBySlug,
  kindForMime,
  updateFileSlug,
} from 'files';

type StatusSetter = {status: number | string};

// Map a domain error message to an HTTP status; returns the message body.
function mapError(set: StatusSetter, error: unknown): string {
  const message = error instanceof Error ? error.message : 'Unexpected error';
  if (
    message.startsWith('Unsupported file type') ||
    message.startsWith('File too large') ||
    message.startsWith('File is empty') ||
    message.startsWith('Slug cannot be empty') ||
    message.startsWith('Could not derive a slug')
  ) {
    set.status = 400;
  } else if (message.startsWith('Slug already in use')) {
    set.status = 409;
  } else if (message.startsWith('File not found')) {
    set.status = 404;
  } else {
    throw error instanceof Error ? error : new Error(message);
  }
  return message;
}

export default new Elysia({prefix: '/files'})
  .get('/', async () => {
    return await findAllFiles();
  })
  .get(
    '/slug/:slug',
    async ({params: {slug}}) => {
      const file = await findFileBySlug(slug);
      if (!file) {
        return new Response('Not found', {status: 404});
      }
      const kind = kindForMime(file.mime_type);
      return {
        id: file.id,
        slug: file.slug,
        original_filename: file.original_filename,
        mime_type: file.mime_type,
        size_bytes: file.size_bytes,
        kind,
        content: kind === 'markdown' ? file.data.toString('utf-8') : null,
        created_at: file.created_at,
        updated_at: file.updated_at,
      };
    },
    {params: t.Object({slug: t.String()})},
  )
  .get(
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
  )
  .post(
    '/',
    async ({body, set}) => {
      try {
        const file = await createFile({
          original_filename: body.filename,
          slug: body.slug ?? null,
          data: Buffer.from(body.dataBase64, 'base64'),
        });
        return {
          id: file.id,
          slug: file.slug,
          original_filename: file.original_filename,
          mime_type: file.mime_type,
          size_bytes: file.size_bytes,
          kind: kindForMime(file.mime_type),
          created_at: file.created_at,
          updated_at: file.updated_at,
        };
      } catch (error) {
        return mapError(set, error);
      }
    },
    {
      body: t.Object({
        filename: t.String(),
        slug: t.Optional(t.Nullable(t.String())),
        dataBase64: t.String(),
      }),
    },
  )
  .post(
    '/cleanup',
    async ({body}) => {
      const days = body?.days ?? 30;
      return await deleteFilesOlderThan(days);
    },
    {body: t.Optional(t.Object({days: t.Optional(t.Numeric())}))},
  )
  .put(
    '/:id',
    async ({params: {id}, body, set}) => {
      try {
        const file = await updateFileSlug(id, {slug: body.slug});
        return {
          id: file.id,
          slug: file.slug,
          original_filename: file.original_filename,
          mime_type: file.mime_type,
          size_bytes: file.size_bytes,
          kind: kindForMime(file.mime_type),
          created_at: file.created_at,
          updated_at: file.updated_at,
        };
      } catch (error) {
        return mapError(set, error);
      }
    },
    {
      params: t.Object({id: t.Numeric()}),
      body: t.Object({slug: t.String()}),
    },
  )
  .delete(
    '/:id',
    async ({params: {id}, set}) => {
      try {
        await deleteFile(id);
      } catch (error) {
        return mapError(set, error);
      }
      return {success: true};
    },
    {params: t.Object({id: t.Numeric()})},
  );
