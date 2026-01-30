export type Location = number[];

export interface Athlete {
  id: number;
  shoes?: Gear[];
}

export interface Gear {
  id: string;
  primary: boolean;
  name: string;
  brand_name: string;
  model_name: string;
  description: string;
  resource_state: number;
  distance: number;
}

export interface Activity {
  athlete: Athlete;
  name: string;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  total_elevation_gain: number;
  type: string;
  sport_type: string;
  workout_type?: string | number | null;
  id: number;
  start_date: string;
  start_date_local: string;
  timezone: string;
  utc_offset: number;
  start_latlng: Location | null;
  end_latlng: Location | null;
  location_city: string | null;
  location_state: string | null;
  location_country: string | null;
  gear_id: string | null;
  average_speed: number;
  max_speed: number;
  average_cadence?: number | null;
  average_watts?: number | null;
  max_watts?: number | null;
  average_heartrate?: number | null;
  max_heartrate?: number | null;
  elev_high?: number | null;
  elev_low?: number | null;
  suffer_score?: number | null;
}

export interface StravaConfig {
  accessToken: string;
}

export interface StravaContainer {
  accessToken: string;
}
