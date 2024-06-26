import {GetContainer} from 'injectx';
import type {RunningConfig} from './Types';
import {createDatabase} from 'database';

export * from './Types';
export {Api} from './api';
export {Bus} from './bus';

export function setupRunningContainer({databaseUrl}: RunningConfig) {
  GetContainer().Bind(createDatabase(databaseUrl), {name: 'database'});
}
