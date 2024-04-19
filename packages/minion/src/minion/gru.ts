import {AMQPClient} from '@cloudamqp/amqp-client';
import {Gru} from './Types';
import {startMinion} from './minion';

const LAVINMQ_URL = process.env.CLOUDAMQP_URL || '';

export async function startGru(gru: Gru) {
  const connection = new AMQPClient(LAVINMQ_URL);
  await connection.connect();

  console.log('[✅] Gru starting to orchestrate minions ...');

  const stopMinions = await Promise.all(
    gru.minions.map((minion) =>
      startMinion(minion, connection, gru.queueParams, gru.consumeParams),
    ),
  );

  return () => {
    stopMinions.forEach((stop) => {
      stop();
    });

    connection.close();
    console.log('[❎] Gru is stopping ...');
  };
}
