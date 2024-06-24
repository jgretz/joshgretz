import {setupGeoapifyContainer} from 'geoapify';
import {setupRunningContainer} from 'running';
import {setupUserContainer} from 'users';
import {setupWorkflowContainer, ServiceBus} from 'workflow';
import z from 'zod';
import {parseEnv} from 'env';

// environment
const envSchema = z.object({
  DATABASE_URL: z.string(),
  AMQP_URL: z.string(),
  AMQP_EXCHANGE: z.string(),
  GEOAPIFY_API_KEY: z.string(),
});
const env = parseEnv(envSchema);

// setup containers
setupUserContainer({databaseUrl: env.DATABASE_URL});
setupRunningContainer({databaseUrl: env.DATABASE_URL});
setupGeoapifyContainer({apiKey: env.GEOAPIFY_API_KEY});
setupWorkflowContainer({amqpUrl: env.AMQP_URL, exchange: env.AMQP_EXCHANGE});

// import Busses
import {Bus as PingBus} from 'ping';
import {Bus as UsersBus} from 'users';
import {Bus as StravaBus} from 'strava';
import {Bus as RunningBus} from 'running';

// run
async function boot() {
  const bus = new ServiceBus().use(PingBus).use(UsersBus).use(StravaBus).use(RunningBus).start();

  console.log('Minions on alert ... To exit press CTRL+C ');
  process.on('SIGINT', async () => {
    await bus.stop();

    process.exit(0);
  });
}
boot();
