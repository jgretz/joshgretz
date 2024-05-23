import type {Amqp} from 'amqp';
import type {Database} from 'database';
import type {Geo} from 'packages/geoapify/src';
import loadActivities from './loadActivities';

export function createTasks(database: Database, amqp: Amqp, geo: Geo) {
  return [loadActivities(database, geo)];
}
