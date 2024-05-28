import type {Database} from 'database';
import {type Amqp} from 'amqp';
import type {AMQPMessage} from '@cloudamqp/amqp-client';

export interface TaskConfig {
  databaseUrl: string;
  amqpUrl: string;
}

export interface TaskContainer {
  database: Database;
  amqp: Amqp;
}

export interface Task {
  queue: string;
  message: string;

  consume: (msg: AMQPMessage) => void | Promise<void>;
}
