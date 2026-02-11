import {Elysia, t} from 'elysia';
import {
  generateAuthUrl,
  requestAuthToken,
} from 'google-sheets';
import {setThirdPartyAccessForUser, type User} from 'users';
import {databasePlugin} from '../plugins/database';
import {Schema} from 'database';

export default new Elysia({prefix: '/google-sheets'})
  .use(databasePlugin)
  .get(
    '/oauth/url',
    ({query: {redirect_uri}}) => {
      return {url: generateAuthUrl(redirect_uri)};
    },
    {
      query: t.Object({
        redirect_uri: t.String(),
      }),
    },
  )
  .get(
    '/oauth/callback',
    async ({query: {code, user_id, redirect_uri}}) => {
      const tokenResponse = await requestAuthToken(code, redirect_uri);

      await setThirdPartyAccessForUser({id: user_id} as User, {
        google_access_token: tokenResponse.access_token,
        google_refresh_token: tokenResponse.refresh_token,
        google_token_expires_at: new Date(
          Date.now() + tokenResponse.expires_in * 1000,
        ),
      });

      return {success: true};
    },
    {
      query: t.Object({
        code: t.String(),
        user_id: t.Numeric(),
        redirect_uri: t.String(),
      }),
    },
  )
  .post(
    '/config',
    async ({body: {user_id, spreadsheet_id}}) => {
      await setThirdPartyAccessForUser({id: user_id} as User, {
        google_spreadsheet_id: spreadsheet_id,
      });
      return {success: true};
    },
    {
      body: t.Object({
        user_id: t.Number(),
        spreadsheet_id: t.String(),
      }),
    },
  )
  .post(
    '/sync',
    async ({database, body: {user_id, from, to, full_sync}}) => {
      const [job] = await database
        .insert(Schema.jobs)
        .values({
          type: 'google-sheets-sync',
          payload: {user_id, from, to, full_sync},
        })
        .returning({id: Schema.jobs.id});
      return {job_id: job.id};
    },
    {
      body: t.Object({
        user_id: t.Number(),
        from: t.Optional(t.String()),
        to: t.Optional(t.String()),
        full_sync: t.Optional(t.Boolean()),
      }),
    },
  );
