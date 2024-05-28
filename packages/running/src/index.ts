import {GetContainer} from 'injectx';
import type {RunningConfig} from './Types';
import {amqp} from 'amqp';
import {createDatabase} from 'database';
import {enqueueLoadActivities} from './command/enqueLoadActivities';
import {findActivityByStravaId} from './query/findActivityByStravaId';
import {findFirstActivityByLatLon} from './query/findFirstActivityByLatLon';

export * from './Types';
export {Api} from './api';

export function setupRunningContainer({databaseUrl, amqpUrl}: RunningConfig) {
  GetContainer()
    .Bind(createDatabase(databaseUrl), {name: 'database'})
    .Bind(amqp(amqpUrl), {name: 'amqp'});
}

export default {
  queries: {
    findActivityByStravaId,
    findFirstActivityByLatLon,
  },

  commands: {
    enqueueLoadActivities,
  },
};
