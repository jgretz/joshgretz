import {eq} from 'drizzle-orm';
import type {UsersContainer} from '../Types';
import {Schema} from 'database';
import {InjectIn} from 'injectx';

const query = ({database}: UsersContainer) => {
  return async (stravaId: number) => {
    const access = await database.query.thirdPartyAccess.findFirst({
      where: eq(Schema.thirdPartyAccess.strava_id, stravaId),
    });

    if (!access) return null;

    const user = await database.query.users.findFirst({
      where: eq(Schema.users.id, access.user_id),
    });

    return user ?? null;
  };
};

export const findUserByStravaId = InjectIn(query);
