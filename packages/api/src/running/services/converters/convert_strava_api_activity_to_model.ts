import {StravaApiActivity} from '../../StravaApiTypes';
import {StravaActivity} from '../../Types';

export function convertStravaApiActivityToModel(
  stravaActivity: StravaApiActivity,
  userId: number,
): StravaActivity {
  return {
    userId,
    strava_id: stravaActivity.id.toString(),
    name: stravaActivity.name,
    type: stravaActivity.type,
    distance: stravaActivity.distance.toString(),
    moving_time: stravaActivity.moving_time.toString(),
    elapsed_time: stravaActivity.elapsed_time.toString(),
    total_elevation_gain: stravaActivity.total_elevation_gain.toString(),
    start_date: stravaActivity.start_date,
    start_date_local: stravaActivity.start_date_local,
    timezone: stravaActivity.timezone,
    utc_offset: stravaActivity.utc_offset,
    start_lat: stravaActivity.start_latlng[0]?.toString(),
    start_lng: stravaActivity.start_latlng[1]?.toString(),
    stop_lat: stravaActivity.end_latlng[0]?.toString(),
    stop_lng: stravaActivity.end_latlng[1]?.toString(),
    location_city: stravaActivity.location_city,
    location_state: stravaActivity.location_state,
    location_country: stravaActivity.location_country,
    gear_id: stravaActivity.gear_id,
    average_speed: stravaActivity.average_speed.toString(),
    max_speed: stravaActivity.max_speed.toString(),
    average_cadence: stravaActivity.average_cadence?.toString(),
    average_watts: stravaActivity.average_watts?.toString(),
    max_watts: stravaActivity.max_watts?.toString(),
    average_heartrate: stravaActivity.average_heartrate?.toString(),
    max_heartrate: stravaActivity.max_heartrate?.toString(),
    elev_high: stravaActivity.elev_high?.toString(),
    elev_low: stravaActivity.elev_low?.toString(),
    suffer_score: stravaActivity.suffer_score?.toString(),
  };
}
