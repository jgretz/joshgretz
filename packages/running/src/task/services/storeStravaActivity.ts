import {type Database, Schema} from 'database';
import type {Activity as StravaActivity} from 'strava';
import {findActivityByStravaId} from '../../query/findActivityByStravaId';
import {eq} from 'drizzle-orm';
import type {Geo} from 'packages/geoapify/src';
import lookupLocationForActivity from './lookupLocationForActivity';

type Activity = Awaited<ReturnType<ReturnType<typeof findActivityByStravaId>>>;

function shouldUpdateLocation(activity: StravaActivity, existingActivity: Activity | undefined) {
  if (!existingActivity) {
    return true;
  }

  if (
    existingActivity.location_city ||
    existingActivity.location_state ||
    existingActivity.location_country
  ) {
    return true;
  }

  if (
    activity.start_latlng[0]?.toString() !== existingActivity.start_lat ||
    activity.start_latlng[1]?.toString() !== existingActivity.start_lng
  ) {
    return true;
  }

  return false;
}

async function mapToActivity(
  database: Database,
  geo: Geo,
  user_id: number,
  activity: StravaActivity,
  existingActivity: Activity,
) {
  // get locaiton data
  const location = shouldUpdateLocation(activity, existingActivity)
    ? await lookupLocationForActivity(database, geo, activity)
    : {
        city: existingActivity?.location_city,
        state: existingActivity?.location_state,
        country: existingActivity?.location_country,
      };

  // map
  return {
    id: existingActivity?.id || undefined,
    user_id,
    strava_id: activity.id.toString(),
    name: activity.name,
    type: activity.type,
    distance: activity.distance.toString(),
    moving_time: activity.moving_time.toString(),
    elapsed_time: activity.elapsed_time.toString(),
    total_elevation_gain: activity.total_elevation_gain.toString(),
    start_date: activity.start_date,
    start_date_local: activity.start_date_local,
    timezone: activity.timezone,
    utc_offset: activity.utc_offset,
    start_lat: activity.start_latlng[0]?.toString(),
    start_lng: activity.start_latlng[1]?.toString(),
    stop_lat: activity.end_latlng[0]?.toString(),
    stop_lng: activity.end_latlng[1]?.toString(),
    location_city: location?.city,
    location_state: location?.state,
    location_country: location?.country,
    gear_id: activity.gear_id,
    average_speed: activity.average_speed.toString(),
    max_speed: activity.max_speed.toString(),
    average_cadence: activity.average_cadence?.toString(),
    average_watts: activity.average_watts?.toString(),
    max_watts: activity.max_watts?.toString(),
    average_heartrate: activity.average_heartrate?.toString(),
    max_heartrate: activity.max_heartrate?.toString(),
    elev_high: activity.elev_high?.toString(),
    elev_low: activity.elev_low?.toString(),
    suffer_score: activity.suffer_score?.toString(),
  };
}

export default function (database: Database, geo: Geo, user_id: number) {
  return async function (stravaActivity: StravaActivity) {
    const existing = await findActivityByStravaId(database)(stravaActivity.id.toString());
    const activity = await mapToActivity(database, geo, user_id, stravaActivity, existing);

    // update or insert
    if (activity.id) {
      console.log('updating activity', activity.id);
      await database
        .update(Schema.activities)
        .set(activity)
        .where(eq(Schema.activities.id, activity.id));
    } else {
      console.log('inserting activity', activity.id);
      await database.insert(Schema.activities).values(activity);
    }
  };
}
