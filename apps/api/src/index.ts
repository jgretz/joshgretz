import Elysia from 'elysia';
import {setupUserContainer} from 'users';
import {setupRunningContainer} from 'running';
import {setupGeoapifyContainer} from 'geoapify';
import health from './routes/health';
import users from './routes/users';
import running from './routes/running';
import strava from './routes/strava';
import stravaWebhook from './routes/strava-webhook';
import jobs from './routes/jobs';
import personalRecords from './routes/personal-records';
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
  STRAVA_WEBHOOK_VERIFY_TOKEN: z.string().optional(),
  TASK_API_KEY: z.string().optional(),
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
  .use(stravaWebhook)
  .use(bearer())
  .guard(
    {
      beforeHandle({set, bearer}) {
        if (bearer !== env.HELMET && bearer !== env.TASK_API_KEY) {
          set.status = 401;
          return 'Unauthorized';
        }
      },
    },
    (app) => app.use(users).use(running).use(strava).use(jobs).use(personalRecords),
  )
  .listen(env.PORT);

console.log(`JoshGretz-API is running at ${root.server?.hostname}:${root.server?.port}`);

// export type for intellisense
export type App = typeof root;
