import type {Amqp} from 'utility';
import type {Database} from '../Types';
import loadActivitiesSince from './loadActivitiesSince';

export function createTasks(database: Database, amqp: Amqp) {
  return [loadActivitiesSince];
}
