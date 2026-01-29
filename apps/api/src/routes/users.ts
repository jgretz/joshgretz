import {Elysia, t} from 'elysia';
import {
  findUserByEmail,
  setThirdPartyAccessForUser,
  thirdPartyAccessForUser,
  type User,
  type ThirdPartyAccess,
} from 'users';

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
    strava_id: t.Optional(t.Number()),
    strava_access_token: t.Optional(t.String()),
    strava_code: t.Optional(t.String()),
    strava_refresh_token: t.Optional(t.String()),
    strava_token_expires_at: t.Optional(t.Date()),
  }),
};

export default new Elysia({prefix: '/users'})
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
      return thirdPartyAccessForUser({id: user_id});
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
