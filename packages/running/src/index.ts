import {GetContainer} from 'injectx';
import type {RunningConfig} from './Types';
import {createDatabase} from 'database';

export * from './Types';
export * from './services';
export {findActivityByStravaId} from './query/findActivityByStravaId';
export {findFirstActivityByLatLon} from './query/findFirstActivityByLatLon';

export const setupRunningContainer = ({databaseUrl}: RunningConfig) => {
  GetContainer().Bind(createDatabase(databaseUrl), {name: 'database'});
};
