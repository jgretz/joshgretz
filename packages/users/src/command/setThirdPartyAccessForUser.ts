import {thirdPartyAccess} from '../schema';
import type {Database, ThirdPartyAccess, User} from '../Types';

export function setThirdPartyAccessForUser(database: Database) {
  return async function (user: User, access: ThirdPartyAccess) {
    await database
      .insert(thirdPartyAccess)
      .values({
        user_id: user.id,
        ...access,
      })
      .onConflictDoUpdate({target: thirdPartyAccess.user_id, set: access});
  };
}
