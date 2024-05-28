import {Schema} from 'database';
import {eq} from 'drizzle-orm';
import type {RunningContainer} from '../Types';
import {InjectIn} from 'injectx';

function query({database}: RunningContainer) {
  return async function (strava_id: string) {
    const activity = await database.query.activities.findFirst({
      where: eq(Schema.activities.strava_id, strava_id),
    });

    return activity;
  };
}

export const findActivityByStravaId = InjectIn(query);
