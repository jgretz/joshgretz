import {GetContainer} from 'injectx';
import type {JobsConfig} from './Types';
import {createDatabase} from 'database';

export * from './Types';
export {listJobs} from './query/listJobs';
export {retryJob} from './command/retryJob';

export const setupJobsContainer = ({databaseUrl}: JobsConfig) => {
  GetContainer().Bind(createDatabase(databaseUrl), {name: 'database'});
};
