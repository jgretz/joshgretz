import {AMQPMessage} from '@cloudamqp/amqp-client';
import {Queues, Tasks} from '../Types';
import type {Task} from 'utility';

function handle(message: AMQPMessage) {
  console.log(message.bodyToString());

  // message.ack();
}

export default {
  queue: Queues.Running,
  message: Tasks.LoadActivitiesSince,

  consume: handle,
} as Task;
