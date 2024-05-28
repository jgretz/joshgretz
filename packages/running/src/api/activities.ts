import {Elysia, t} from 'elysia';
import type {User} from 'users';
import {enqueueLoadActivities} from '../command/enqueLoadActivities';

const enqueueLoadActivitiesSinceCommandSchema = {
  body: t.Object({
    user_id: t.Number(),
    from: t.Date(),
    to: t.Date(),
  }),
};

export default new Elysia({prefix: '/activities'}).post(
  '/load-activities',
  async ({body: {user_id, from, to}}) => {
    await enqueueLoadActivities({id: user_id} as User, from, to);
  },
  enqueueLoadActivitiesSinceCommandSchema,
);
