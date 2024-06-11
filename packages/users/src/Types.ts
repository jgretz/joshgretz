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
}

export interface ThirdPartyAccessForUserRequest {
  user_id: number;
}

export interface ThirdPartyAccessForUserResponse {
  access?: ThirdPartyAccess;
}

export enum UsersCommands {
  ThirdPartyAccessForUser = 'ThirdPartyAccessForUser',
}

export enum UsersEvents {
  ThirdPartyAccessForUserResponse = 'ThirdPartyAccessForUserResponse',
}
