import {Schema, type Database} from 'database';
import {eq} from 'drizzle-orm';

export function findUserByEmail(database: Database) {
  return async function (email: string) {
    const user = await database.query.users.findFirst({
      where: eq(Schema.users.email, email),
    });

    return user;
  };
}
