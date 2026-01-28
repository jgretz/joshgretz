import {Elysia, t} from 'elysia';
import {importActivitiesForDateRange} from 'running';

const importActivitiesSchema = {
  body: t.Object({
    user_id: t.Number(),
    from: t.Date(),
    to: t.Date(),
  }),
};

export default new Elysia({prefix: '/running'}).post(
  '/activities/import-activities',
  async ({body: {user_id, from, to}}) => {
    await importActivitiesForDateRange(user_id, from, to);
  },
  importActivitiesSchema,
);
