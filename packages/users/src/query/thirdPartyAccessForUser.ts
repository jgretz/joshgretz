import {eq} from 'drizzle-orm';
import {thirdPartyAccess} from '../schema';
import type {Database, User} from '../Types';

export function thirdPartyAccessForUser(database: Database) {
  return async function (user: User) {
    const access = await database.query.thirdPartyAccess.findFirst({
      where: eq(thirdPartyAccess.user_id, user.id),
    });

    return access;
  };
}
