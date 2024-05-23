import {Elysia, t} from 'elysia';
import type {User} from 'users';
import type {Amqp} from 'amqp';
import {enqueueLoadActivities} from '../command/enqueLoadActivities';

const enqueueLoadActivitiesSinceCommandSchema = {
  body: t.Object({
    user_id: t.Number(),
    from: t.Date(),
    to: t.Date(),
  }),
};

export function createApi(amqp: Amqp) {
  return new Elysia({prefix: '/activities'})
    .decorate('enqueueLoadActivities', enqueueLoadActivities(amqp))
    .post(
      '/load-activities',
      async ({body: {user_id, from, to}, enqueueLoadActivities}) => {
        await enqueueLoadActivities({id: user_id} as User, from, to);
      },
      enqueueLoadActivitiesSinceCommandSchema,
    );
}
