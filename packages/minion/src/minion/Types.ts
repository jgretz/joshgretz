import {AMQPMessage, ConsumeParams, QueueParams} from '@cloudamqp/amqp-client';

export interface Gru {
  minions: Minion[];

  queueParams?: QueueParams;
  consumeParams?: ConsumeParams;
}

export interface Minion {
  queueName: string;
  consume: (msg: AMQPMessage) => void | Promise<void>;

  queueParams?: QueueParams;
  consumeParams?: ConsumeParams;
}
