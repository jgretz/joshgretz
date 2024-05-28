import gru from './gru';
import {setupGeoapifyContainer} from 'geoapify';
import {setupRunningContainer} from 'running';
import {setupUserContainer} from 'users';
import tasks, {setupTaskContainer} from './tasks';

// environment
const DATABASE_URL = process.env.DATABASE_URL || '';
const AMPQ_URL = process.env.AMQP_URL || '';
const GEOAPIFY_API_KEY = process.env.GEOAPIFY_API_KEY || '';

// setup containers
setupTaskContainer({databaseUrl: DATABASE_URL, amqpUrl: AMPQ_URL});
setupUserContainer({databaseUrl: DATABASE_URL});
setupRunningContainer({databaseUrl: DATABASE_URL, amqpUrl: AMPQ_URL});
setupGeoapifyContainer({apiKey: GEOAPIFY_API_KEY});

// run
async function boot() {
  const stop = await gru(tasks);

  console.log('Minions on alert ... To exit press CTRL+C ');
  process.on('SIGINT', () => {
    stop();

    process.exit(0);
  });
}
boot();
