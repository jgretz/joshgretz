import {Schema} from 'database';
import {eq} from 'drizzle-orm';
import {InjectIn} from 'injectx';
import type {UsersContainer} from '../Types';

const query = function ({database}: UsersContainer) {
  return async function (email: string) {
    const user = await database.query.users.findFirst({
      where: eq(Schema.users.email, email),
    });

    return user;
  };
};

export const findUserByEmail = InjectIn(query);
