import Elysia from 'elysia';
import {setupUserContainer, Api as UsersApi} from 'users';
import {setupRunningContainer, Api as RunningApi} from 'running';
import Health from './health';
import bearer from '@elysiajs/bearer';

// environment
const PORT = process.env.PORT || 3003;
const DATABASE_URL = process.env.DATABASE_URL || '';
const AMPQ_URL = process.env.AMQP_URL || '';

// setup IOC / DI containers
setupUserContainer({databaseUrl: DATABASE_URL});
setupRunningContainer({databaseUrl: DATABASE_URL, amqpUrl: AMPQ_URL});

// run
const root = new Elysia()
  .use(Health)
  .use(bearer())
  .guard(
    {
      beforeHandle({set, bearer}) {
        if (bearer !== process.env.HELMET) return (set.status = 'Unauthorized');
      },
    },
    (app) => {
      return app.use(UsersApi).use(RunningApi);
    },
  )
  .listen(PORT);

console.log(`JoshGretz-API is running at ${root.server?.hostname}:${root.server?.port}`);

// export type for intellisense
export type App = typeof root;
