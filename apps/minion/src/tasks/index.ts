import {createDatabase} from 'database';
import {loadActivities} from './loadActivities';
import {GetContainer} from 'injectx';
import type {MinionConfig} from '../Types';
import {amqp} from 'amqp';

export function setupTaskContainer({databaseUrl, amqpUrl}: MinionConfig) {
  GetContainer().Bind(createDatabase(databaseUrl), {name: 'database'});
  GetContainer().Bind(amqp(amqpUrl), {name: 'amqp'});
}

export default [loadActivities];
