import {connect} from './rabbit/connect';
import {createConsumer} from './rabbit/createConsumer';

export function consume<T>(key: string, handler: (payload: T) => any | Promise<any>) {
  const rabbit = connect();
  const consumer = createConsumer(rabbit, key, async (message, reply) => {
    const payload = JSON.parse(message.body) as T;
    const response = await handler(payload);

    if (response) {
      return await reply(JSON.stringify(response));
    }
  });

  return async () => {
    await consumer.close();
    await rabbit.close();
  };
}
