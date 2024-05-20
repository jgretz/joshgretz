import {db, amqp} from 'utility';
import type {RunningConfig} from './Types';
import * as schema from './schema';
import {createApi} from './api';
import {createTasks} from './task';

export * from './Types';

export default function (config: RunningConfig) {
  const database = db(config.databaseUrl, schema);
  const amqpWrapper = amqp(config.amqpUrl);

  return {
    Api: createApi(database, amqpWrapper),
    Tasks: createTasks(database, amqpWrapper),
  };
}
