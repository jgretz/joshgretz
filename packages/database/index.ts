import {drizzle, type PostgresJsDatabase} from 'drizzle-orm/postgres-js';
import * as RunningSchema from './schema/running.schema';
import * as UserSchema from './schema/user.schema';
import * as JobsSchema from './schema/jobs.schema';
import postgres from 'postgres';

export type DatabaseSchema = typeof RunningSchema & typeof UserSchema & typeof JobsSchema;
export type Database = PostgresJsDatabase<DatabaseSchema>;

export const Schema = {
  ...RunningSchema,
  ...UserSchema,
  ...JobsSchema,
};

export function createDatabase(databaseUrl: string): PostgresJsDatabase<DatabaseSchema> {
  const queryClient = postgres(databaseUrl);
  return drizzle(queryClient, {schema: Schema});
}
