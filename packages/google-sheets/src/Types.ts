export type GoogleTokenResponse = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
};

export type GoogleRefreshTokenResponse = {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
};

export type ActivityRow = {
  date: string | null;
  name: string | null;
  type: string | null;
  distance: string | null;
  moving_time: string | null;
  elapsed_time: string | null;
  total_elevation_gain: string | null;
  average_speed: string | null;
  max_speed: string | null;
  average_heartrate: string | null;
  max_heartrate: string | null;
  average_cadence: string | null;
  average_watts: string | null;
  max_watts: string | null;
  suffer_score: string | null;
  location_city: string | null;
  location_state: string | null;
  elev_high: string | null;
  elev_low: string | null;
  gear_id: string | null;
  strava_id: string | null;
};
