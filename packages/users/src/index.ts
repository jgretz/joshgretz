import {GetContainer} from 'injectx';
import type {UsersConfig} from './Types.ts';
import {createDatabase} from 'database';
import {findUserByEmail} from './query/findUserByEmail.ts';
import {thirdPartyAccessForUser} from './query/thirdPartyAccessForUser.ts';
import {setThirdPartyAccessForUser} from './command/setThirdPartyAccessForUser.ts';

export * from './Types.ts';
export {Api} from './api/index';
export {Bus} from './services/index';

export function setupUserContainer({databaseUrl}: UsersConfig) {
  GetContainer().Bind(createDatabase(databaseUrl), {name: 'database'});
}

export default {
  queries: {
    findUserByEmail,
    thirdPartyAccessForUser,
  },

  commands: {
    setThirdPartyAccessForUser,
  },
};
