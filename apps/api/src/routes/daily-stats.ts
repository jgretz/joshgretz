import {Elysia, t} from 'elysia';
import {findDailyStatsByUserIdAndYear, recalculateDailyStats} from 'running';

export default new Elysia({prefix: '/daily-stats'})
  .get(
    '/',
    async ({query: {user_id, year}}) => {
      const stats = await findDailyStatsByUserIdAndYear(user_id, year);
      return stats;
    },
    {
      query: t.Object({
        user_id: t.Numeric(),
        year: t.Numeric(),
      }),
    },
  )
  .post(
    '/recalculate',
    async ({body: {user_id, dates}}) => {
      const result = await recalculateDailyStats(user_id, dates);
      return result;
    },
    {
      body: t.Object({
        user_id: t.Number(),
        dates: t.Optional(t.Array(t.String())),
      }),
    },
  );
