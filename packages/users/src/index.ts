import {db} from 'utility';
import type {UsersConfig} from './Types.ts';
import * as schema from './schema';
import {createApi} from './api';

export * from './Types.ts';

export default function (config: UsersConfig) {
  const database = db(config.databaseUrl, schema);

  return {
    Api: createApi(database),
  };
}
