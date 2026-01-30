import {Elysia, t} from 'elysia';
import {
  findFutureRacesByUserId,
  findFutureRaceById,
  createFutureRace,
  updateFutureRace,
  deleteFutureRace,
} from 'running';

export default new Elysia({prefix: '/future-races'})
  .get(
    '/',
    async ({query: {user_id}}) => {
      return await findFutureRacesByUserId(user_id);
    },
    {
      query: t.Object({
        user_id: t.Numeric(),
      }),
    },
  )
  .get(
    '/:id',
    async ({params: {id}}) => {
      const record = await findFutureRaceById(id);
      if (!record) {
        return new Response('Not found', {status: 404});
      }
      return record;
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
      return await createFutureRace(body);
    },
    {
      body: t.Object({
        user_id: t.Number(),
        title: t.String(),
        location: t.Optional(t.Nullable(t.String())),
        distance: t.Optional(t.Nullable(t.String())),
        url: t.Optional(t.Nullable(t.String())),
        race_date: t.Optional(t.Nullable(t.String())),
      }),
    },
  )
  .put(
    '/:id',
    async ({params: {id}, body}) => {
      const record = await updateFutureRace(id, body);
      if (!record) {
        return new Response('Not found', {status: 404});
      }
      return record;
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
      body: t.Object({
        title: t.Optional(t.String()),
        location: t.Optional(t.Nullable(t.String())),
        distance: t.Optional(t.Nullable(t.String())),
        url: t.Optional(t.Nullable(t.String())),
        race_date: t.Optional(t.Nullable(t.String())),
      }),
    },
  )
  .delete(
    '/:id',
    async ({params: {id}}) => {
      await deleteFutureRace(id);
      return {success: true};
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
    },
  );
