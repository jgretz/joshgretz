import {createDatabase} from 'database';
import type {UsersConfig} from './Types.ts';
import {createApi} from './api';

export * from './Types.ts';
export {thirdPartyAccessForUser} from './query/thirdPartyAccessForUser';

export default function (config: UsersConfig) {
  const database = createDatabase(config.databaseUrl);

  return {
    Api: createApi(database),
  };
}
