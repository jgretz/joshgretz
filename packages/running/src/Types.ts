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
  created_at: Date | null;
  updated_at: Date | null;
};

export type CreatePersonalRecordInput = {
  user_id: number;
  title: string;
  time_seconds: number;
  activity_id?: number | null;
};

export type UpdatePersonalRecordInput = {
  title?: string;
  time_seconds?: number;
  activity_id?: number | null;
};

export type FutureRace = {
  id: number;
  user_id: number;
  title: string;
  location: string | null;
  distance: string | null;
  url: string | null;
  race_date: string | null;
  created_at: Date | null;
  updated_at: Date | null;
};

export type CreateFutureRaceInput = {
  user_id: number;
  title: string;
  location?: string | null;
  distance?: string | null;
  url?: string | null;
  race_date?: string | null;
};

export type UpdateFutureRaceInput = {
  title?: string;
  location?: string | null;
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
  created_at: Date | null;
  updated_at: Date | null;
};

export type UpsertStreakInput = {
  user_id: number;
  start_date?: string | null;
  total_runs?: number | null;
  total_miles?: string | null;
  total_vert?: number | null;
};

export type StateStats = {
  id: number;
  user_id: number;
  state: string;
  run_count: number | null;
  marathon_count: number | null;
  created_at: Date | null;
  updated_at: Date | null;
};

export type UpsertStateStatsInput = {
  user_id: number;
  state: string;
  run_count?: number | null;
  marathon_count?: number | null;
};
