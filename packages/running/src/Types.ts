import type {Database} from 'database';

export interface RunningConfig {
  databaseUrl: string;
}

export interface RunningContainer {
  database: Database;
}

export type PersonalRecord = {
  id: number;
  user_id: number;
  title: string;
  time_seconds: number;
  activity_id: number | null;
  distance: string | null;
  pace_seconds: number | null;
  race_name: string | null;
  race_location: string | null;
  strava_id: string | null;
  race_date: string | null;
  created_at: Date | null;
  updated_at: Date | null;
};

export type CreatePersonalRecordInput = {
  user_id: number;
  title: string;
  time_seconds: number;
  activity_id?: number | null;
  distance?: string | null;
  pace_seconds?: number | null;
  race_name?: string | null;
  race_location?: string | null;
  strava_id?: string | null;
  race_date?: string | null;
};

export type UpdatePersonalRecordInput = {
  title?: string;
  time_seconds?: number;
  activity_id?: number | null;
  distance?: string | null;
  pace_seconds?: number | null;
  race_name?: string | null;
  race_location?: string | null;
  strava_id?: string | null;
  race_date?: string | null;
};

export type FutureRace = {
  id: number;
  user_id: number;
  title: string;
  location: string | null;
  state: string | null;
  distance: string | null;
  url: string | null;
  race_date: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type CreateFutureRaceInput = {
  user_id: number;
  title: string;
  location?: string | null;
  state?: string | null;
  distance?: string | null;
  url?: string | null;
  race_date?: string | null;
};

export type UpdateFutureRaceInput = {
  title?: string;
  location?: string | null;
  state?: string | null;
  distance?: string | null;
  url?: string | null;
  race_date?: string | null;
};

export type Streak = {
  id: number;
  user_id: number;
  start_date: string | null;
  total_runs: number | null;
  total_miles: string | null;
  total_vert: number | null;
  last_run_date: string | null;
  created_at: Date | null;
  updated_at: Date | null;
};

export type UpsertStreakInput = {
  user_id: number;
  start_date?: string | null;
  total_runs?: number | null;
  total_miles?: string | null;
  total_vert?: number | null;
  last_run_date?: string | null;
};

export type StateStats = {
  id: number;
  user_id: number;
  state: string;
  run_count: number | null;
  marathon_count: number | null;
  first_marathon_name: string | null;
  first_marathon_date: string | null;
  first_marathon_strava_id: string | null;
  created_at: Date | null;
  updated_at: Date | null;
};

export type UpsertStateStatsInput = {
  user_id: number;
  state: string;
  run_count?: number | null;
  marathon_count?: number | null;
  first_marathon_name?: string | null;
  first_marathon_date?: string | null;
  first_marathon_strava_id?: string | null;
};

export type DailyStats = {
  id: number;
  user_id: number;
  date: string;
  total_miles: string | null;
  run_count: number | null;
  created_at: Date | null;
  updated_at: Date | null;
};

export type UpsertDailyStatsInput = {
  user_id: number;
  date: string;
  total_miles?: string | null;
  run_count?: number | null;
};

// One copy of a suspected duplicate. Enough columns to tell two recordings of the same run
// apart by hand — there is no device column to do it for us.
export type DuplicateActivitySide = {
  id: number;
  strava_id: string;
  name: string | null;
  type: string | null;
  start_date: string | null;
  start_date_local: string | null;
  distance: string | null;
  moving_time: string | null;
  elapsed_time: string | null;
  total_elevation_gain: string | null;
  average_heartrate: string | null;
  gear_id: string | null;
  start_lat: string | null;
  start_lng: string | null;
  location_city: string | null;
  location_state: string | null;
  location_country: string | null;
  featured_marathon: boolean | null;
};

export type DuplicateActivityCandidate = {
  a: DuplicateActivitySide;
  b: DuplicateActivitySide;
  start_delta_seconds: number;
  distance_delta_meters: string;
};

export type UpdateActivityDetailsInput = {
  location_city?: string | null;
  location_state?: string | null;
  location_country?: string | null;
  featured_marathon?: boolean;
};
