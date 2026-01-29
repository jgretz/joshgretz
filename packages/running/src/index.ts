import {GetContainer} from 'injectx';
import type {RunningConfig} from './Types';
import {createDatabase} from 'database';

export * from './Types';
export * from './services';
export {findActivityByStravaId} from './query/findActivityByStravaId';
export {findFirstActivityByLatLon} from './query/findFirstActivityByLatLon';
export {findPersonalRecordsByUserId} from './query/findPersonalRecordsByUserId';
export {findPersonalRecordById} from './query/findPersonalRecordById';
export {createPersonalRecord} from './command/createPersonalRecord';
export {updatePersonalRecord} from './command/updatePersonalRecord';
export {deletePersonalRecord} from './command/deletePersonalRecord';

export const setupRunningContainer = ({databaseUrl}: RunningConfig) => {
  GetContainer().Bind(createDatabase(databaseUrl), {name: 'database'});
};
