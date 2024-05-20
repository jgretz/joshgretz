import {Elysia, t} from 'elysia';
import Running from 'running';
import type {User} from 'users';

const enqueueLoadActivitiesSinceCommandSchema = {
  body: t.Object({
    user_id: t.Number(),
    date: t.Date(),
  }),
};

const {
  command: {enqueueLoadActivitiesSince},
} = Running({databaseUrl: process.env.DATABASE_URL || '', amqpUrl: process.env.AMQP_URL || ''});

export default new Elysia({prefix: '/activities'}).post(
  '/load-since',
  async ({body: {user_id, date}}) => {
    await enqueueLoadActivitiesSince({id: user_id} as User, date);
  },
  enqueueLoadActivitiesSinceCommandSchema,
);
