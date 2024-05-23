import gru from './gru';
import {amqp} from 'amqp';
import Running from 'running';

// environment
const DATABASE_URL = process.env.DATABASE_URL || '';
const AMPQ_URL = process.env.AMQP_URL || '';
const GEOAPIFY_API_KEY = process.env.GEOAPIFY_API_KEY || '';

// Tasks
const {Tasks: RunningTasks} = Running({
  databaseUrl: DATABASE_URL,
  amqpUrl: AMPQ_URL,
  geoApiKey: GEOAPIFY_API_KEY,
});
const tasks = [...RunningTasks];

// run
async function boot() {
  const amqpWrapper = amqp(AMPQ_URL);
  const stop = await gru(amqpWrapper, tasks);

  console.log('Minions on alert ... To exit press CTRL+C ');
  process.on('SIGINT', () => {
    stop();

    process.exit(0);
  });
}
boot();
