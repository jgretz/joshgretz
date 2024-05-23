import {eq} from 'drizzle-orm';
import type {User} from '../Types';
import {Schema, type Database} from 'database';

export function thirdPartyAccessForUser(database: Database) {
  return async function (user: User) {
    const access = await database.query.thirdPartyAccess.findFirst({
      where: eq(Schema.thirdPartyAccess.user_id, user.id),
    });

    return access;
  };
}
