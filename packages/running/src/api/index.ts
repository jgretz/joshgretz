import Elysia from 'elysia';
import {createApi as createActivitiesApi} from './activities';
import type {Database} from 'database';
import type {Amqp} from 'amqp';

export function createApi(database: Database, amqp: Amqp) {
  return new Elysia({prefix: '/running'}).use(createActivitiesApi(amqp));
}
