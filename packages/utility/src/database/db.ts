import {drizzle, type PostgresJsDatabase} from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

export function db<TSchema extends Record<string, unknown>>(
  databaseUrl: string,
  schema: TSchema,
): PostgresJsDatabase<TSchema> {
  const queryClient = postgres(databaseUrl);
  return drizzle(queryClient, {schema});
}
