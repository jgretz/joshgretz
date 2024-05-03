import {db} from 'utility';
import type {RunningConfig} from './Types.ts';
import * as schema from './schema';

export * from './Types.ts';

export default function (config: RunningConfig) {
  const database = db(config.databaseUrl, schema);

  return {
    database,
  };
}
