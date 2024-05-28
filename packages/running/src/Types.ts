import type {Amqp} from 'amqp';
import type {Database} from 'database';

export interface RunningConfig {
  databaseUrl: string;
  amqpUrl: string;
}

export interface RunningContainer {
  database: Database;
  amqp: Amqp;
}

export enum Queues {
  Running = 'running',
}

export enum Tasks {
  LoadActivitiesSince = 'load-activities-since',
}
