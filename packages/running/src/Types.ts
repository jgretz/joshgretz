import type {Database} from 'database';

export interface RunningConfig {
  databaseUrl: string;
}

export interface RunningContainer {
  database: Database;
}
