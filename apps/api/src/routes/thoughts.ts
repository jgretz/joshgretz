import {Elysia, t} from 'elysia';
import {
  findAllThoughts,
  findPublishedThoughts,
  findThoughtBySlug,
  findThoughtById,
  createThought,
  updateThought,
  deleteThought,
} from 'thoughts';

export default new Elysia({prefix: '/thoughts'})
  .get('/', async () => {
    return await findAllThoughts();
  })
  .get('/published', async () => {
    return await findPublishedThoughts();
  })
  .get(
    '/slug/:slug',
    async ({params: {slug}}) => {
      const thought = await findThoughtBySlug(slug);
      if (!thought) {
        return new Response('Not found', {status: 404});
      }
      return thought;
    },
    {
      params: t.Object({
        slug: t.String(),
      }),
    },
  )
  .get(
    '/:id',
    async ({params: {id}}) => {
      const thought = await findThoughtById(id);
      if (!thought) {
        return new Response('Not found', {status: 404});
      }
      return thought;
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
    },
  )
  .post(
    '/',
    async ({body}) => {
      return await createThought(body);
    },
    {
      body: t.Object({
        title: t.String(),
        slug: t.String(),
        content: t.String(),
        description: t.Optional(t.Nullable(t.String())),
        tags: t.Optional(t.Nullable(t.Array(t.String()))),
        published_at: t.Optional(t.Nullable(t.String())),
      }),
    },
  )
  .put(
    '/:id',
    async ({params: {id}, body}) => {
      const thought = await updateThought(id, body);
      if (!thought) {
        return new Response('Not found', {status: 404});
      }
      return thought;
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
      body: t.Object({
        title: t.Optional(t.String()),
        slug: t.Optional(t.String()),
        content: t.Optional(t.String()),
        description: t.Optional(t.Nullable(t.String())),
        tags: t.Optional(t.Nullable(t.Array(t.String()))),
        published_at: t.Optional(t.Nullable(t.String())),
      }),
    },
  )
  .delete(
    '/:id',
    async ({params: {id}}) => {
      await deleteThought(id);
      return {success: true};
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
    },
  );
