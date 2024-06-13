import {setupGeoapifyContainer} from 'geoapify';
import {setupRunningContainer} from 'running';
import {setupUserContainer} from 'users';
import {setupWorkflowContainer, ServiceBus} from 'workflow';

// environment
const DATABASE_URL = process.env.DATABASE_URL || '';
const AMPQ_URL = process.env.AMQP_URL || '';
const AMPQ_EXCHANGE = process.env.AMQP_EXCHANGE || '';
const GEOAPIFY_API_KEY = process.env.GEOAPIFY_API_KEY || '';

// setup containers
setupUserContainer({databaseUrl: DATABASE_URL});
setupRunningContainer({databaseUrl: DATABASE_URL});
setupGeoapifyContainer({apiKey: GEOAPIFY_API_KEY});
setupWorkflowContainer({amqpUrl: AMPQ_URL, exchange: AMPQ_EXCHANGE});

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
