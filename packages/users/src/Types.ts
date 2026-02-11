import type {Database} from 'database';

export interface UsersConfig {
  databaseUrl: string;
}

export interface UsersContainer {
  database: Database;
}

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
  strava_refresh_token?: string | null;
  strava_token_expires_at?: Date | null;
  google_access_token?: string | null;
  google_refresh_token?: string | null;
  google_token_expires_at?: Date | null;
  google_spreadsheet_id?: string | null;
}
