import {Schema} from 'database';
import type {ThirdPartyAccess, User, UsersContainer} from '../Types';
import {InjectIn} from 'injectx';

const command = function ({database}: UsersContainer) {
  return async function (user: User, access: ThirdPartyAccess) {
    await database
      .insert(Schema.thirdPartyAccess)
      .values({
        user_id: user.id,
        ...access,
      })
      .onConflictDoUpdate({target: Schema.thirdPartyAccess.user_id, set: access});
  };
};

export const setThirdPartyAccessForUser = InjectIn(command);
