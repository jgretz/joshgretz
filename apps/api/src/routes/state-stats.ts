import {Elysia, t} from 'elysia';
import {findStateStatsByUserId, recalculateStateStats} from 'running';

export default new Elysia({prefix: '/state-stats'})
  .get(
    '/',
    async ({query: {user_id}}) => {
      const stats = await findStateStatsByUserId(user_id);
      return stats;
    },
    {
      query: t.Object({
        user_id: t.Numeric(),
      }),
    },
  )
  .post(
    '/recalculate',
    async ({body: {user_id}}) => {
      const result = await recalculateStateStats(user_id);
      return result;
    },
    {
      body: t.Object({
        user_id: t.Number(),
      }),
    },
  );
