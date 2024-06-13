import {Schema} from 'database';
import type {Activity as StravaActivity} from 'strava';
import {type RunningContainer} from 'running';
import {eq} from 'drizzle-orm';
import {InjectIn} from 'injectx';
import {mapStravaActivityToRunningActivity} from './mapStravaActivityToRunningActivity';
import {findActivityByStravaId} from '../../query/findActivityByStravaId';

function service({database}: RunningContainer) {
  return async function (stravaActivity: StravaActivity, user_id: number) {
    const existing = await findActivityByStravaId(stravaActivity.id.toString());
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
