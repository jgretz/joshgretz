import {db} from 'utility';
import type {UsersConfig} from './Types.ts';
import * as schema from './schema';

import {findUserByEmail} from './query/findUserByEmail.ts';
import {thirdPartyAccessForUser} from './query/thirdPartyAccessForUser.ts';

import {setThirdPartyAccessForUser} from './command/setThirdPartyAccessForUser.ts';

export * from './Types.ts';

export default function (config: UsersConfig) {
  const database = db(config.databaseUrl, schema);

  return {
    database,

    query: {
      findUserByEmail: findUserByEmail(database),
      thirdPartyAccessForUser: thirdPartyAccessForUser(database),
    },

    command: {
      setThirdPartyAccessForUser: setThirdPartyAccessForUser(database),
    },
  };
}
