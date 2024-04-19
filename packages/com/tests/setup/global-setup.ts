import path from 'node:path';
import fsExtra from 'fs-extra';

export const BASE_DATABASE_PATH = path.join(process.cwd(), `./tests/drizzle/base.db`);

export async function setup() {
  const databaseExists = await fsExtra.pathExists(BASE_DATABASE_PATH);
  if (databaseExists) return;

  // This is where Epic Stack creates a base copy of the test db that is later
  // copied and used by the e2e tests. We don't have e2e yet, but it could look
  // something like this for us:
  // const sqlite = new Database(BASE_DATABASE_PATH);
  // const db = drizzle(sqlite, { schema, logger: true });
  // migrate(db, { migrationsFolder: './app/db/migrations' });
}
