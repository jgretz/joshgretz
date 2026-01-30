import {Elysia, t} from 'elysia';
import {findStreakByUserId, upsertStreak} from 'running';

export default new Elysia({prefix: '/streak'})
  .get(
    '/',
    async ({query: {user_id}}) => {
      const streak = await findStreakByUserId(user_id);
      return streak ?? null;
    },
    {
      query: t.Object({
        user_id: t.Numeric(),
      }),
    },
  )
  .put(
    '/',
    async ({body}) => {
      return await upsertStreak(body);
    },
    {
      body: t.Object({
        user_id: t.Number(),
        start_date: t.Optional(t.Nullable(t.String())),
        total_runs: t.Optional(t.Nullable(t.Number())),
        total_miles: t.Optional(t.Nullable(t.String())),
        total_vert: t.Optional(t.Nullable(t.Number())),
      }),
    },
  );
