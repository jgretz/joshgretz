import {AMQPClient} from '@cloudamqp/amqp-client';

export type AmqpWrapper = {
  connection: AMQPClient;
  publish(queue: string, key: string, message: string): Promise<void>;
};

export function amqp(url: string) {
  const connection = new AMQPClient(url);

  return {
    connection,

    async publish(queue: string, key: string, message: string) {
      await connection.connect();

      const channel = await connection.channel();
      await channel.queue(queue, {durable: false});

      await channel.basicPublish('', key, message);

      connection.close();
    },
  };
}
