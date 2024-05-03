import {
  pgTable,
  integer,
  serial,
  varchar,
  boolean,
  numeric,
  uniqueIndex,
  timestamp,
  index,
} from 'drizzle-orm/pg-core';

export const users = pgTable(
  'strava_access',
  {
    id: serial('id').primaryKey(),
    user_id: numeric('user_id').notNull(),
    admin: boolean('admin').default(false).notNull(),
    strava_id: integer('strava_id'),
    strava_access_token: varchar('strava_access_token', {length: 50}),
    strava_code: varchar('strava_code', {length: 50}),
  },
  (users) => {
    return {
      userIdIndex: uniqueIndex('userId_idx').on(users.user_id),
    };
  },
);

export const activities = pgTable(
  'activities',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id),

    strava_id: varchar('strava_id', {length: 50}).notNull(),
    name: varchar('name', {length: 300}),
    type: varchar('type', {length: 50}),
    distance: numeric('distance'),
    moving_time: numeric('moving_time'),
    elapsed_time: numeric('elapsed_time'),
    total_elevation_gain: numeric('total_elevation_gain'),
    start_date: timestamp('start_date', {mode: 'string'}),
    start_date_local: timestamp('start_date_local', {mode: 'string'}),
    timezone: varchar('timezone', {length: 50}),
    utc_offset: integer('utc_offset'),
    start_lat: numeric('start_lat'),
    start_lng: numeric('start_lng'),
    stop_lat: numeric('stop_lat'),
    stop_lng: numeric('stop_lng'),
    location_city: varchar('location_city', {length: 100}),
    location_state: varchar('location_state', {length: 100}),
    location_country: varchar('location_country', {length: 100}),
    gear_id: varchar('gear_id', {length: 100}),
    average_speed: numeric('average_speed'),
    max_speed: numeric('max_speed'),
    average_cadence: numeric('average_cadence'),
    average_watts: numeric('average_watts'),
    max_watts: numeric('max_watts'),
    average_heartrate: numeric('average_heartrate'),
    max_heartrate: numeric('max_heartrate'),
    elev_high: numeric('elev_high'),
    elev_low: numeric('elev_low'),
    suffer_score: numeric('suffer_score'),
  },
  (activities) => {
    return {
      userIdIndex: index('user_id_idx').on(activities.userId),
      stravaIdIndex: uniqueIndex('strava_id_idx').on(activities.strava_id),
      latLonIndex: index('lat_lon_idx').on(activities.start_lat, activities.start_lng),
    };
  },
);

export const gear = pgTable(
  'gear',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id),

    strava_id: varchar('gear_id', {length: 100}).notNull(),
    brand_name: varchar('brand_name', {length: 300}),
    model_name: varchar('model_name', {length: 300}),
    description: varchar('description', {length: 300}),
    resource_state: integer('resource_state'),
    distance: numeric('distance'),
  },
  (gear) => {
    return {
      userIdIndex: index('user_id_idx').on(gear.userId),
      stravaIdIndex: uniqueIndex('strava_id_idx').on(gear.strava_id),
    };
  },
);
