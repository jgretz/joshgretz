import {Elysia, t} from 'elysia';
import {Schema} from 'database';
import {storeStravaActivity, searchActivities} from 'running';
import {databasePlugin} from '../plugins/database';

const importActivitiesSchema = {
  body: t.Object({
    user_id: t.Number(),
    from: t.Date(),
    to: t.Date(),
  }),
};

const storeActivitySchema = {
  body: t.Object({
    user_id: t.Number(),
    activity: t.Object({
      athlete: t.Object({
        id: t.Number(),
        shoes: t.Optional(
          t.Array(
            t.Object({
              id: t.String(),
              primary: t.Boolean(),
              name: t.String(),
              brand_name: t.String(),
              model_name: t.String(),
              description: t.String(),
              resource_state: t.Number(),
              distance: t.Number(),
            }),
          ),
        ),
      }),
      name: t.String(),
      distance: t.Number(),
      moving_time: t.Number(),
      elapsed_time: t.Number(),
      total_elevation_gain: t.Number(),
      type: t.String(),
      sport_type: t.String(),
      workout_type: t.Optional(t.Nullable(t.Union([t.String(), t.Number()]))),
      id: t.Number(),
      start_date: t.String(),
      start_date_local: t.String(),
      timezone: t.String(),
      utc_offset: t.Number(),
      start_latlng: t.Nullable(t.Array(t.Number())),
      end_latlng: t.Nullable(t.Array(t.Number())),
      location_city: t.Nullable(t.String()),
      location_state: t.Nullable(t.String()),
      location_country: t.Nullable(t.String()),
      gear_id: t.Nullable(t.String()),
      average_speed: t.Number(),
      max_speed: t.Number(),
      average_cadence: t.Optional(t.Nullable(t.Number())),
      average_watts: t.Optional(t.Nullable(t.Number())),
      max_watts: t.Optional(t.Nullable(t.Number())),
      average_heartrate: t.Optional(t.Nullable(t.Number())),
      max_heartrate: t.Optional(t.Nullable(t.Number())),
      elev_high: t.Optional(t.Nullable(t.Number())),
      elev_low: t.Optional(t.Nullable(t.Number())),
      suffer_score: t.Optional(t.Nullable(t.Number())),
    }),
  }),
};

export default new Elysia({prefix: '/running'})
  .use(databasePlugin)
  .get(
    '/activities/search',
    async ({query: {user_id, q, strava_id}}) => {
      return await searchActivities({userId: user_id, query: q, stravaId: strava_id});
    },
    {
      query: t.Object({
        user_id: t.Numeric(),
        q: t.Optional(t.String()),
        strava_id: t.Optional(t.String()),
      }),
    },
  )
  .post(
    '/activities/import-activities',
    async ({database, body: {user_id, from, to}}) => {
      const [job] = await database
        .insert(Schema.jobs)
        .values({
          type: 'mass-import',
          payload: {user_id, from: from.toISOString(), to: to.toISOString()},
        })
        .returning({id: Schema.jobs.id});
      return {job_id: job.id};
    },
    importActivitiesSchema,
  )
  .post(
    '/activities',
    async ({body: {user_id, activity}}) => {
      await storeStravaActivity(activity, user_id);
      return {success: true};
    },
    storeActivitySchema,
  );
