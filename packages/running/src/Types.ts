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
