import Elysia from 'elysia';
import {setupUserContainer} from 'users';
import {setupRunningContainer} from 'running';
import {setupGeoapifyContainer} from 'geoapify';
import health from './routes/health';
import users from './routes/users';
import running from './routes/running';
import strava from './routes/strava';
import bearer from '@elysiajs/bearer';
import cors from '@elysiajs/cors';
import z from 'zod';
import {parseEnv} from 'env';

// environment
const envSchema = z.object({
  PORT: z.string(),
  DATABASE_URL: z.string(),
  HELMET: z.string(),
  GEOAPIFY_API_KEY: z.string(),
});
const env = parseEnv(envSchema);

// setup IOC / DI containers
setupUserContainer({databaseUrl: env.DATABASE_URL});
setupRunningContainer({databaseUrl: env.DATABASE_URL});
setupGeoapifyContainer({apiKey: env.GEOAPIFY_API_KEY});

// run
const root = new Elysia()
  .use(health)
  .use(cors())
  .use(bearer())
  .guard(
    {
      beforeHandle({set, bearer}) {
        if (bearer !== env.HELMET) {
          set.status = 401;
          return 'Unauthorized';
        }
      },
    },
    (app) => app.use(users).use(running).use(strava),
  )
  .listen(env.PORT);

console.log(`JoshGretz-API is running at ${root.server?.hostname}:${root.server?.port}`);

// export type for intellisense
export type App = typeof root;
