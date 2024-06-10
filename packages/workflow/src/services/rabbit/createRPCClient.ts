import type Connection from 'rabbitmq-client';
import type {WorkflowContainer} from '../../Types';
import {InjectIn} from 'injectx';

function create({exchange}: WorkflowContainer) {
  return function (rabbit: Connection) {
    return rabbit.createRPCClient({
      // Enable publish confirmations, similar to consumer acknowledgements
      confirm: true,
      // Enable retries
      maxAttempts: 2,
      // Optionally ensure the existence of an exchange before we use it
      exchanges: [{exchange, type: 'topic'}],
    });
  };
}

export const createRPCClient = InjectIn(create);
