import type {AMQPMessage} from '@cloudamqp/amqp-client';

export interface Task {
  queue: string;
  message: string;

  consume: (msg: AMQPMessage) => void | Promise<void>;
}
