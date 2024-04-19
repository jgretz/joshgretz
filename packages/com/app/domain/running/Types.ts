export type ActivityType = 'Run' | 'Race' | 'Workout' | 'Long Run';

export interface Activity {
  id: number;
  userId: number;
  strava_id: string;
  name: string;
  type: ActivityType;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  total_elevation_gain: number;
  start_date: Date;
  start_date_local: Date;
  timezone: string;
  utc_offset: number;
  start_lat: number;
  start_lng: number;
  stop_lat: number;
  stop_lng: number;
  location_city: string;
  location_state: string;
  location_country: string;
  gear_id: string;
  average_speed: number;
  max_speed: number;
  average_cadence: number;
  average_watts: number;
  max_watts: number;
  average_heartrate: number;
  max_heartrate: number;
  elev_high: number;
  elev_low: number;
  suffer_score: number;
}
