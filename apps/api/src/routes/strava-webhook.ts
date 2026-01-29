import {Elysia, t} from 'elysia';
import {Schema} from 'database';
import {eq} from 'drizzle-orm';
import {databasePlugin} from '../plugins/database';

const verifySchema = {
  query: t.Object({
    'hub.mode': t.String(),
    'hub.verify_token': t.String(),
    'hub.challenge': t.String(),
  }),
};

const eventSchema = {
  body: t.Object({
    object_type: t.String(),
    object_id: t.Number(),
    aspect_type: t.String(),
    owner_id: t.Number(),
    subscription_id: t.Number(),
    event_time: t.Number(),
  }),
};

export default new Elysia({prefix: '/strava/webhook'})
  .use(databasePlugin)
  .get(
    '/',
    ({query, set}) => {
      const verifyToken = process.env.STRAVA_WEBHOOK_VERIFY_TOKEN;
      if (query['hub.verify_token'] !== verifyToken) {
        set.status = 403;
        return 'Invalid verify token';
      }
      return {'hub.challenge': query['hub.challenge']};
    },
    verifySchema,
  )
  .post(
    '/',
    async ({database, body}) => {
      const {object_type, object_id, aspect_type, owner_id} = body;

      // Only handle activity events
      if (object_type !== 'activity') {
        return {received: true};
      }

      // Find user by strava owner_id
      const access = await database.query.thirdPartyAccess.findFirst({
        where: eq(Schema.thirdPartyAccess.strava_id, owner_id),
      });

      if (!access) {
        console.log(`No user found for Strava owner_id: ${owner_id}`);
        return {received: true};
      }

      // Create job for activity import
      await database.insert(Schema.jobs).values({
        type: 'activity-import',
        payload: {
          user_id: access.user_id,
          activity_id: object_id,
          aspect_type,
        },
      });

      return {received: true};
    },
    eventSchema,
  );
