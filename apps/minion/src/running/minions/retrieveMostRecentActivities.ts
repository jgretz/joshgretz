import {AMQPMessage} from '@cloudamqp/amqp-client';
import type {Minion} from '../../domain';

function handle(message: AMQPMessage) {}

export default {
  queueName: 'retrieveMostRecentActivities',
  consume: handle,
} as Minion;
