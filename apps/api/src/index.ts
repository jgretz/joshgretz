import Elysia from 'elysia';
import {setupUserContainer, Api as UsersApi} from 'users';
import {setupRunningContainer, Api as RunningApi} from 'running';
import {Api as Ping} from 'ping';
import Health from './health';
import bearer from '@elysiajs/bearer';
import cors from '@elysiajs/cors';
import z from 'zod';
import {setupWorkflowContainer} from 'workflow';
import {parseEnv} from 'env';

// environment
const envSchema = z.object({
  PORT: z.string(),
  DATABASE_URL: z.string(),
  AMQP_URL: z.string(),
  AMQP_EXCHANGE: z.string(),
  HELMET: z.string(),
});
const env = parseEnv(envSchema);

// setup IOC / DI containers
setupUserContainer({databaseUrl: env.DATABASE_URL});
setupRunningContainer({databaseUrl: env.DATABASE_URL});
setupWorkflowContainer({amqpUrl: env.AMQP_URL, exchange: env.AMQP_EXCHANGE});

// run
const root = new Elysia()
  .use(Health)
  .use(cors())
  .use(bearer())
  .guard(
    {
      beforeHandle({set, bearer}) {
        if (bearer !== env.HELMET) return (set.status = 'Unauthorized');
      },
    },
    (app) => {
      return app.use(UsersApi).use(RunningApi).use(Ping);
    },
  )
  .listen(env.PORT);

console.log(`JoshGretz-API is running at ${root.server?.hostname}:${root.server?.port}`);

// export type for intellisense
export type App = typeof root;
