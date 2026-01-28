export interface User {
  id: number;
  name: string;
  email: string;
  admin: boolean;
}

export interface ThirdPartyAccess {
  strava_id?: number | null;
  strava_access_token?: string | null;
  strava_code?: string | null;
}
