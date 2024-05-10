import {eq} from 'drizzle-orm';
import {users} from '../schema';
import type {Database} from '../Types';

export function findUserByEmail(database: Database) {
  return async function (email: string) {
    const user = await database.query.users.findFirst({
      where: eq(users.email, email),
    });

    return user;
  };
}
