import {AMQPClient, QueueParams, ConsumeParams} from '@cloudamqp/amqp-client';
import {Minion} from './Types';

export async function startMinion(
  minion: Minion,
  connection: AMQPClient,
  gruQueueParams: QueueParams = {},
  gruConsumeParams: ConsumeParams = {},
) {
  const queueParams = {
    ...gruQueueParams,
    ...(minion.queueParams || {}),
  };

  const consumeParams = {
    ...gruConsumeParams,
    ...(minion.consumeParams || {}),
  };

  const channel = await connection.channel();
  const queue = await channel.queue(minion.queueName, queueParams);

  console.log(`[✅] Minion for ${minion.queueName} is ready and willing ...`);

  await queue.subscribe(consumeParams, async (msg) => {
    try {
      await minion.consume(msg);

      console.log(`[✅] Minion for ${minion.queueName} completed their task ...`);
    } catch (error) {
      console.log(`[❌] Error by minion for ${minion.queueName}`);
      console.error(error);
    }
  });

  return () => {
    console.log(`[❎] Minion for ${minion.queueName} is stopping ...`);

    channel.close();
  };
}
