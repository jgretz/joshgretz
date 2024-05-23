import {Schema, type Database} from 'database';
import {eq} from 'drizzle-orm';

export function findActivityByStravaId(database: Database) {
  return async function (strava_id: string) {
    const activity = await database.query.activities.findFirst({
      where: eq(Schema.activities.strava_id, strava_id),
    });

    return activity;
  };
}
