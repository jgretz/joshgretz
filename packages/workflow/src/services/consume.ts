import {connect} from './rabbit/connect';
import {createConsumer} from './rabbit/createConsumer';
import {encapsulate} from './utility/encapsulate';

export function consume<T>(
  key: string,
  handler: <R extends {} | void>(payload: T) => R | Promise<R>,
) {
  const rabbit = connect();

  const consumer = createConsumer(rabbit, key, async (message, reply) => {
    try {
      const payload = JSON.parse(message.body) as T;
      const response = await handler(payload);

      if (response && message.replyTo) {
        await reply(encapsulate(response));
      }
    } catch (error) {
      console.log(key);
      console.error(error);
    }
  });

  return async () => {
    await consumer.close();
    await rabbit.close();
  };
}
