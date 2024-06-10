import type Connection from 'rabbitmq-client';
import type {WorkflowContainer} from '../../Types';
import {InjectIn} from 'injectx';

function create({exchange}: WorkflowContainer) {
  return function (rabbit: Connection) {
    return rabbit.createPublisher({
      confirm: true,
      maxAttempts: 2,
      exchanges: [{exchange, type: 'topic'}],
    });
  };
}

export const createPublisher = InjectIn(create);
