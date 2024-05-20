import {Elysia, t} from 'elysia';
import type {User} from 'users';
import {enqueueLoadActivitiesSince} from '../command/enqueLoadActivitiesSince';
import type {Amqp} from 'utility';

const enqueueLoadActivitiesSinceCommandSchema = {
  body: t.Object({
    user_id: t.Number(),
    date: t.Date(),
  }),
};

export function createApi(amqp: Amqp) {
  return new Elysia({prefix: '/activities'})
    .decorate('enqueueLoadActivitiesSince', enqueueLoadActivitiesSince(amqp))
    .post(
      '/load-since',
      async ({body: {user_id, date}, enqueueLoadActivitiesSince}) => {
        await enqueueLoadActivitiesSince({id: user_id} as User, date);
      },
      enqueueLoadActivitiesSinceCommandSchema,
    );
}
