import {AMQPMessage} from '@cloudamqp/amqp-client';
import type {Minion} from '../../domain';

function handle(message: AMQPMessage) {}

export default {
  queueName: Queues.Running,
  consume: handle,
} as Minion;
