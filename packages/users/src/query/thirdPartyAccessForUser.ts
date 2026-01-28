import {eq} from 'drizzle-orm';
import type {UsersContainer} from '../Types';
import {Schema} from 'database';
import {InjectIn} from 'injectx';

const query = ({database}: UsersContainer) => {
  return async (user: {id: number}) => {
    const access = await database.query.thirdPartyAccess.findFirst({
      where: eq(Schema.thirdPartyAccess.user_id, user.id),
    });

    return access;
  };
};

export const thirdPartyAccessForUser = InjectIn(query);
