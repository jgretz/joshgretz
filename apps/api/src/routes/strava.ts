import {Elysia, t} from 'elysia';
import {generateAuthUrl, requestAuthToken} from 'strava';
import {setThirdPartyAccessForUser, type User} from 'users';

const generateAuthUrlSchema = {
  query: t.Object({
    redirect_uri: t.String(),
  }),
};

const callbackSchema = {
  query: t.Object({
    code: t.String(),
    user_id: t.Numeric(),
  }),
};

export default new Elysia({prefix: '/strava'})
  .get(
    '/oauth/url',
    ({query: {redirect_uri}}) => {
      return {url: generateAuthUrl(redirect_uri)};
    },
    generateAuthUrlSchema,
  )
  .get(
    '/oauth/callback',
    async ({query: {code, user_id}}) => {
      const tokenResponse = await requestAuthToken(code);

      await setThirdPartyAccessForUser({id: user_id} as User, {
        strava_id: tokenResponse.athlete.id,
        strava_access_token: tokenResponse.access_token,
        strava_refresh_token: tokenResponse.refresh_token,
        strava_token_expires_at: new Date(tokenResponse.expires_at * 1000),
        strava_code: code,
      });

      return {success: true};
    },
    callbackSchema,
  );
