import {Elysia, t} from 'elysia';
import {findUserByEmail} from '../query/findUserByEmail';
import {setThirdPartyAccessForUser} from '../command/setThirdPartyAccessForUser';
import {thirdPartyAccessForUser} from '../query/thirdPartyAccessForUser';
import type {User, ThirdPartyAccess} from '../Types';

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

export const Api = new Elysia({prefix: '/users'})
  .get(
    '/query',
    ({query: {email}}): Promise<User | undefined> => {
      return findUserByEmail(email);
    },
    userFromEmailQuerySchema,
  )
  .get(
    '/third-party-access',
    ({query: {user_id}}): Promise<ThirdPartyAccess | undefined> => {
      return thirdPartyAccessForUser({id: user_id} as User);
    },
    thirdPartyAccessForUserQuerySchema,
  )
  .post(
    '/third-party-access',
    async ({body: {user_id, ...access}}) => {
      await setThirdPartyAccessForUser({id: user_id} as User, access);
    },
    thirdPartyAccessForUserCommandSchema,
  );
