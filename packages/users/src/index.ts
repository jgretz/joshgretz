import {GetContainer} from 'injectx';
import type {UsersConfig} from './Types';
import {createDatabase} from 'database';

export * from './Types';
export {findUserByEmail} from './query/findUserByEmail';
export {findUserByStravaId} from './query/findUserByStravaId';
export {thirdPartyAccessForUser} from './query/thirdPartyAccessForUser';
export {setThirdPartyAccessForUser} from './command/setThirdPartyAccessForUser';

export const setupUserContainer = ({databaseUrl}: UsersConfig) => {
  GetContainer().Bind(createDatabase(databaseUrl), {name: 'database'});
};
