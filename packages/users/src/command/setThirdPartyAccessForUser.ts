import {Schema, type Database} from 'database';
import type {ThirdPartyAccess, User} from '../Types';

export function setThirdPartyAccessForUser(database: Database) {
  return async function (user: User, access: ThirdPartyAccess) {
    await database
      .insert(Schema.thirdPartyAccess)
      .values({
        user_id: user.id,
        ...access,
      })
      .onConflictDoUpdate({target: Schema.thirdPartyAccess.user_id, set: access});
  };
}
