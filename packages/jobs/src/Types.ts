import type {Database} from 'database';

export type JobsConfig = {
  databaseUrl: string;
};

export type JobsContainer = {
  database: Database;
};
