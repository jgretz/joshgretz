import {Injectable} from '@nestjs/common';
import {drizzle, PostgresJsDatabase} from 'drizzle-orm/postgres-js';
import * as postgres from 'postgres';
import * as schema from '../schema';

@Injectable()
export class DrizzleService {
  db: PostgresJsDatabase<typeof schema>;

  constructor() {
    const queryClient = postgres(process.env.DATABASE_URL);
    this.db = drizzle(queryClient, {schema});
  }
}
