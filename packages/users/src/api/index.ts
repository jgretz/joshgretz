import {Elysia, t} from 'elysia';
import {findUserByEmail} from '../query/findUserByEmail';
import {setThirdPartyAccessForUser} from '../command/setThirdPartyAccessForUser';
import {thirdPartyAccessForUser} from '../query/thirdPartyAccessForUser';
import type {User, ThirdPartyAccess, Database} from '../Types';

const userFromEmailQuerySchema = {
  query: t.Object({
    email: t.String({
      format: 'email',
    }),
  }),
};

const thirdPartyAccessForUserQuerySchema = {
  query: t.Object({
    user_id: t.Numeric(),
  }),
};

const thirdPartyAccessForUserCommandSchema = {
  body: t.Object({
    user_id: t.Number(),
    strava_id: t.Number(),
    strava_access_token: t.String(),
    strava_code: t.String(),
  }),
};

export function createApi(database: Database) {
  return new Elysia({prefix: '/users'})
    .decorate('findUserByEmail', findUserByEmail(database))
    .decorate('thirdPartyAccessForUser', thirdPartyAccessForUser(database))
    .decorate('setThirdPartyAccessForUser', setThirdPartyAccessForUser(database))
    .get(
      '/query',
      ({query: {email}, findUserByEmail}): Promise<User | undefined> => {
        return findUserByEmail(email);
      },
      userFromEmailQuerySchema,
    )
    .get(
      '/third-party-access',
      ({query: {user_id}, thirdPartyAccessForUser}): Promise<ThirdPartyAccess | undefined> => {
        return thirdPartyAccessForUser({id: user_id} as User);
      },
      thirdPartyAccessForUserQuerySchema,
    )
    .post(
      '/third-party-access',
      async ({body: {user_id, ...access}, setThirdPartyAccessForUser}) => {
        await setThirdPartyAccessForUser({id: user_id} as User, access);
      },
      thirdPartyAccessForUserCommandSchema,
    );
}
