import type {PostgresJsDatabase} from 'drizzle-orm/postgres-js';

export interface UsersConfig {
  databaseUrl: string;
}

export type Database = PostgresJsDatabase<typeof import('./schema')>;

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
