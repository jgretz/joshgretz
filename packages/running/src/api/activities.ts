import {Elysia, t} from 'elysia';
import {publish} from 'workflow';
import {RunningWorkflows} from '../Types';

const enqueueImportStravaActivitiesForDateRangeSchema = {
  body: t.Object({
    user_id: t.Number(),
    from: t.Date(),
    to: t.Date(),
  }),
};

export default new Elysia({prefix: '/activities'}).post(
  '/import-activities',
  async ({body: {user_id, from, to}}) => {
    await publish(RunningWorkflows.ImportStravaActivitiesForDateRange, {user_id, from, to});
  },
  enqueueImportStravaActivitiesForDateRangeSchema,
);
