import type Connection from 'rabbitmq-client';
import type {WorkflowContainer} from '../../Types';
import {InjectIn} from 'injectx';
import type {ConsumerHandler} from 'rabbitmq-client';

function create({exchange}: WorkflowContainer) {
  return function (rabbit: Connection, key: string, handler: ConsumerHandler) {
    return rabbit.createConsumer(
      {
        queue: key,
        queueOptions: {durable: true},
        exchanges: [{exchange, type: 'topic'}],
      },
      handler,
    );
  };
}

export const createConsumer = InjectIn(create);
