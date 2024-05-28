import {eq} from 'drizzle-orm';
import type {User, UsersContainer} from '../Types';
import {Schema} from 'database';
import {InjectIn} from 'injectx';

const query = function ({database}: UsersContainer) {
  return async function (user: User) {
    const access = await database.query.thirdPartyAccess.findFirst({
      where: eq(Schema.thirdPartyAccess.user_id, user.id),
    });

    return access;
  };
};

export const thirdPartyAccessForUser = InjectIn(query);
