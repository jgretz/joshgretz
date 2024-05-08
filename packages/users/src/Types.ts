import type {PostgresJsDatabase} from 'drizzle-orm/postgres-js';

export interface UsersConfig {
  databaseUrl: string;
}

export type Database = PostgresJsDatabase<typeof import('./schema')>;

export type User = {
  id: number;
  name: string;
  email: string;
  admin: boolean;
};
