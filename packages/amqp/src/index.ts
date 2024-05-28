import {AMQPClient, AMQPMessage} from '@cloudamqp/amqp-client';
import {ManagedKeyedQueues} from './queues/ManagedKeyedQueues';

export type Amqp = {
  publish(queue: string, key: string, message: string): Promise<void>;
  subscribe(
    queue: string,
    key: string,
    consume: (msg: AMQPMessage) => void | Promise<void>,
  ): Promise<() => void>;
};

export function amqp(url: string) {
  const connection = new AMQPClient(url);
  const memQueue = new ManagedKeyedQueues<void>();

  return {
    async publish(queue: string, key: string, message: string) {
      const queueKey = `${queue}:${key}`;
      const args = {
        onStart: async () => {
          console.log('Connecting to AMQP');
          await connection.connect();
        },
        onEmpty: async () => {
          console.log('Closing Connection to AMQP');
          await connection.close();
        },
      };

      memQueue.push(args, queueKey, async () => {
        console.log('Publishing message');

        try {
          const channel = await connection.channel();
          await channel.queue(queue, {durable: false});

          await channel.basicPublish('', queue, message, {headers: {key}});
        } catch (error) {
          console.error('Error publishing message', error);
        }
      });

      setTimeout(async () => {
        await memQueue.pop(queueKey);
      }, 250);
    },

    async subscribe(
      queue: string,
      key: string,
      consume: (msg: AMQPMessage) => void | Promise<void>,
    ) {
      const queueKey = `${queue}:${key}`;
      const args = {
        onStart: async () => {
          console.log('Connecting to AMQP');
          await connection.connect();
        },
        onEmpty: async () => {
          console.log('Closing Connection to AMQP');
          await connection.close();
        },
      };

      memQueue.push(args, queueKey, async () => {
        console.log('Subscribing to message');

        try {
          const channel = await connection.channel();
          const channelQueue = await channel.queue(queue, {durable: false});

          await channelQueue.subscribe({noAck: true}, async (msg) => {
            if (msg.properties.headers?.key === key) {
              console.log(`Received message: ${queueKey}`);
              await consume(msg);
            }
          });
        } catch (error) {
          console.error('Error subscribing to message', error);
        }
      });

      return () => {
        memQueue.pop(queueKey);
      };
    },
  };
}
