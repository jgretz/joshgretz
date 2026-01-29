import {Elysia, t} from 'elysia';
import {
  findPersonalRecordsByUserId,
  findPersonalRecordById,
  createPersonalRecord,
  updatePersonalRecord,
  deletePersonalRecord,
} from 'running';

export default new Elysia({prefix: '/personal-records'})
  .get(
    '/',
    async ({query: {user_id}}) => {
      return await findPersonalRecordsByUserId(user_id);
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
      const record = await findPersonalRecordById(id);
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
      return await createPersonalRecord(body);
    },
    {
      body: t.Object({
        user_id: t.Number(),
        title: t.String(),
        time_seconds: t.Number(),
        activity_id: t.Optional(t.Nullable(t.Number())),
      }),
    },
  )
  .put(
    '/:id',
    async ({params: {id}, body}) => {
      const record = await updatePersonalRecord(id, body);
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
        time_seconds: t.Optional(t.Number()),
        activity_id: t.Optional(t.Nullable(t.Number())),
      }),
    },
  )
  .delete(
    '/:id',
    async ({params: {id}}) => {
      await deletePersonalRecord(id);
      return {success: true};
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
    },
  );
