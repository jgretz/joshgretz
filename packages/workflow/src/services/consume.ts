import {connect} from './rabbit/connect';
import {createConsumer} from './rabbit/createConsumer';

export function consume<T>(key: string, handler: (payload: T) => any | Promise<any>) {
  const rabbit = connect();

  const consumer = createConsumer(rabbit, key, async (message, reply) => {
    try {
      const payload = JSON.parse(message.body) as T;
      const response = await handler(payload);

      if (response && message.replyTo) {
        const json = JSON.stringify(response);
        if (json.length > Math.pow(2, 15)) {
          console.log('Response too large to send');
          return;
        }
        await reply(json);
      }
    } catch (error) {
      console.error(error);
    }
  });

  return async () => {
    await consumer.close();
    await rabbit.close();
  };
}
