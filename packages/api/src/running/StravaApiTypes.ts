export type StravaLocation = number[];

export interface StravaApiAthlete {
  id: number;
  shoes: StravaApiGear[];
}

export interface StravaApiGear {
  id: string;
  primary: boolean;
  name: string;
  brand_name: string;
  model_name: string;
  description: string;
  resource_state: number;
  distance: number;
}

export interface StravaApiActivity {
  athlete: StravaApiAthlete;
  name: string;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  total_elevation_gain: number;
  type: string;
  sport_type: string;
  workout_type: string;
  id: number;
  start_date: string;
  start_date_local: string;
  timezone: string;
  utc_offset: number;
  start_latlng: StravaLocation;
  end_latlng: StravaLocation;
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
