import type {RunningConfig} from './Types';
import {createApi} from './api';
import {createTasks} from './task';
import {amqp} from 'amqp';
import {createDatabase} from 'database';
import Geo from 'packages/geoapify/src';

export * from './Types';

export default function (config: RunningConfig) {
  const database = createDatabase(config.databaseUrl);
  const amqpWrapper = amqp(config.amqpUrl);
  const geo = Geo({apiKey: config.geoApiKey || ''}); // TODO: fix this key being optional so the API doesnt need it - really need a context concept

  return {
    Api: createApi(database, amqpWrapper),
    Tasks: createTasks(database, amqpWrapper, geo),
  };
}
