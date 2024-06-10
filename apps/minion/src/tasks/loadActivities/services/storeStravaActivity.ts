import {Schema} from 'database';
import type {Activity as StravaActivity} from 'strava';
import Running from 'running';
import {eq} from 'drizzle-orm';
import type {MinionContainer} from 'apps/minion/src/Types';
import {InjectIn} from 'injectx';
import {mapStravaActivityToRunningActivity} from './mapStravaActivityToRunningActivity';

function service({database}: MinionContainer) {
  return async function (stravaActivity: StravaActivity, user_id: number) {
    const existing = await Running.queries.findActivityByStravaId(stravaActivity.id.toString());
    const activity = await mapStravaActivityToRunningActivity(user_id, stravaActivity, existing);

    // update or insert
    if (activity.id) {
      console.log('updating activity', activity.id);
      await database
        .update(Schema.activities)
        .set(activity)
        .where(eq(Schema.activities.id, activity.id));
    } else {
      console.log(`inserting activity named ${activity.name} on ${activity.start_date}`);
      await database.insert(Schema.activities).values(activity);
    }
  };
}

export const storeStravaActivity = InjectIn(service);
