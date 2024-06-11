import Connection from 'rabbitmq-client';
import type {WorkflowContainer} from '../../Types';
import {InjectIn} from 'injectx';

function create({amqpUrl}: WorkflowContainer) {
  return function () {
    const rabbit = new Connection({
      url: amqpUrl,
      frameMax: Math.pow(2, 31) - 1,
    });

    rabbit.on('error', (err) => {
      console.log('RabbitMQ connection error', err);
    });
    rabbit.on('connection', () => {
      console.log('Connection successfully (re)established');
    });

    return rabbit;
  };
}

export const connect = InjectIn(create);
