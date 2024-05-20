// import {db} from 'utility';
import {amqp} from 'utility';
import type {RunningConfig} from './Types.ts';
import {enqueueLoadActivitiesSince} from './command/enqueLoadActivitiesSince.ts';
// import * as schema from './schema';

export * from './Types.ts';
export {Api} from './api';

export default function (config: RunningConfig) {
  // const database = db(config.databaseUrl, schema);
  const amqpWrapper = amqp(config.amqpUrl);

  return {
    command: {
      enqueueLoadActivitiesSince: enqueueLoadActivitiesSince(amqpWrapper),
    },
  };
}
