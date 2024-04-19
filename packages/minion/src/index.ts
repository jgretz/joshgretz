import {} from 'dotenv/config';
import {startMinions} from './minion';
import runningMinions from './running';

const gru = {
  minions: [...runningMinions],
};

async function boot() {
  const stopMinions = await startMinions(gru);

  console.log('Waiting to activate minions ... To exit press CTRL+C ');
  process.on('SIGINT', () => {
    stopMinions();

    process.exit(0);
  });
}
boot();
