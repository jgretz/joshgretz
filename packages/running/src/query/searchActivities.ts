import {Schema} from 'database';
import {and, eq, ilike} from 'drizzle-orm';
import type {RunningContainer} from '../Types';
import {InjectIn} from 'injectx';

type SearchInput = {
  userId: number;
  query?: string;
  stravaId?: string;
};

const search = ({database}: RunningContainer) => {
  return async ({userId, query, stravaId}: SearchInput) => {
    const conditions = [eq(Schema.activities.user_id, userId)];

    if (query) {
      conditions.push(ilike(Schema.activities.name, `%${query}%`));
    }

    if (stravaId) {
      conditions.push(eq(Schema.activities.strava_id, stravaId));
    }

    return await database
      .select({
        id: Schema.activities.id,
        name: Schema.activities.name,
        strava_id: Schema.activities.strava_id,
        start_date_local: Schema.activities.start_date_local,
        distance: Schema.activities.distance,
      })
      .from(Schema.activities)
      .where(and(...conditions));
  };
};

export const searchActivities = InjectIn(search);
