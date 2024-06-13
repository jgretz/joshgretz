import {Orchestrator} from 'workflow';
import {importStravaActivitiesForDateRange} from './importStravaActivitiesForDateRange';

function log(message: string) {
  return function () {
    console.log(message);
  };
}

const importHook = {
  key: 'importStravaActivitiesForDateRange',

  beforeExecute: log('Starting to import activities'),
  afterExecute: log('Done importing activities'),
};

export const Bus = new Orchestrator().useHook(importHook).use(importStravaActivitiesForDateRange);
