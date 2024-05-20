import Elysia from 'elysia';
import {createApi as createActivitiesApi} from './activities';
import {type Amqp} from 'utility';
import type {Database} from '../Types';

export function createApi(database: Database, amqp: Amqp) {
  return new Elysia({prefix: '/running'}).use(createActivitiesApi(amqp));
}
