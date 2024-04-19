import {AMQPMessage} from '@cloudamqp/amqp-client';
import {Minion} from '../../minion';

function handle(message: AMQPMessage) {}

export default {
  queueName: 'retrieveMostRecentActivities',
  consume: handle,
} as Minion;
