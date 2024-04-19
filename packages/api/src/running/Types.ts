export interface StravaActivity {
  id?: number;
  userId: number;

  strava_id: string;
  name: string;
  type: string;
  distance: string;
  moving_time: string;
  elapsed_time: string;
  total_elevation_gain: string;
  start_date: string;
  start_date_local: string;
  timezone: string;
  utc_offset: number;
  start_lat: string;
  start_lng: string;
  stop_lat: string;
  stop_lng: string;
  location_city: string;
  location_state: string;
  location_country: string;
  gear_id: string;
  average_speed: string;
  max_speed: string;
  average_cadence: string;
  average_watts: string;
  max_watts: string;
  average_heartrate: string;
  max_heartrate: string;
  elev_high: string;
  elev_low: string;
  suffer_score: string;
}
