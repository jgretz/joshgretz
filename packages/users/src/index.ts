import {GetContainer} from 'injectx';
import type {UsersConfig} from './Types.ts';
import {createDatabase} from 'database';

export * from './Types.ts';
export {Api} from './api/index';
export {Bus} from './bus/index';

export function setupUserContainer({databaseUrl}: UsersConfig) {
  GetContainer().Bind(createDatabase(databaseUrl), {name: 'database'});
}
