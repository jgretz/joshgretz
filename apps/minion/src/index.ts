import {setupGeoapifyContainer} from 'geoapify';
import {setupRunningContainer} from 'running';
import {setupUserContainer} from 'users';
import {setupWorkflowContainer, startServiceBus} from 'workflow';

// environment
const DATABASE_URL = process.env.DATABASE_URL || '';
const AMPQ_URL = process.env.AMQP_URL || '';
const GEOAPIFY_API_KEY = process.env.GEOAPIFY_API_KEY || '';

// setup containers
setupUserContainer({databaseUrl: DATABASE_URL});
setupRunningContainer({databaseUrl: DATABASE_URL, amqpUrl: AMPQ_URL});
setupGeoapifyContainer({apiKey: GEOAPIFY_API_KEY});
setupWorkflowContainer({amqpUrl: AMPQ_URL, exchange: 'workflow'});

// import services
import {Ping} from 'ping';

// run
async function boot() {
  const stop = await startServiceBus([Ping]);

  console.log('Minions on alert ... To exit press CTRL+C ');
  process.on('SIGINT', () => {
    stop();

    process.exit(0);
  });
}
boot();
