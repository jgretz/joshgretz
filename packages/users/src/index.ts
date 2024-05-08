import {db} from 'utility';
import type {UsersConfig} from './Types.ts';
import * as schema from './schema';
import {findUserByEmail} from './services/findUserByEmail.ts';

export * from './Types.ts';

export default function (config: UsersConfig) {
  const database = db(config.databaseUrl, schema);

  return {
    database,

    query: {
      findUserByEmail: findUserByEmail(database),
    },
  };
}
