import {
  pgTable,
  integer,
  serial,
  varchar,
  numeric,
  uniqueIndex,
  timestamp,
  date,
  index,
} from 'drizzle-orm/pg-core';

export const activities = pgTable(
  'activities',
  {
    id: serial('id').primaryKey(),
    user_id: integer('user_id').notNull(),

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
      userIdIndex: index('activity_user_id_idx').on(activities.user_id),
      stravaIdIndex: uniqueIndex('activity_strava_id_idx').on(activities.strava_id),
      latLonIndex: index('activity_lat_lon_idx').on(activities.start_lat, activities.start_lng),
    };
  },
);

export const gear = pgTable(
  'gear',
  {
    id: serial('id').primaryKey(),
    user_id: integer('user_id').notNull(),

    strava_id: varchar('gear_id', {length: 100}).notNull(),
    brand_name: varchar('brand_name', {length: 300}),
    model_name: varchar('model_name', {length: 300}),
    description: varchar('description', {length: 300}),
    resource_state: integer('resource_state'),
    distance: numeric('distance'),
  },
  (gear) => {
    return {
      userIdIndex: index('gear_user_id_idx').on(gear.user_id),
      stravaIdIndex: uniqueIndex('gear_strava_id_idx').on(gear.strava_id),
    };
  },
);

export const personalRecords = pgTable(
  'personal_records',
  {
    id: serial('id').primaryKey(),
    user_id: integer('user_id').notNull(),
    title: varchar('title', {length: 200}).notNull(),
    time_seconds: integer('time_seconds').notNull(),
    activity_id: integer('activity_id'),
    distance: varchar('distance', {length: 50}),
    pace_seconds: integer('pace_seconds'),
    race_name: varchar('race_name', {length: 300}),
    race_location: varchar('race_location', {length: 300}),
    strava_id: varchar('strava_id', {length: 50}),
    race_date: timestamp('race_date', {mode: 'string'}),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow(),
  },
  (pr) => {
    return {
      userIdIdx: index('pr_user_id_idx').on(pr.user_id),
      activityIdIdx: index('pr_activity_id_idx').on(pr.activity_id),
    };
  },
);

export const futureRaces = pgTable(
  'future_races',
  {
    id: serial('id').primaryKey(),
    user_id: integer('user_id').notNull(),
    title: varchar('title', {length: 200}).notNull(),
    location: varchar('location', {length: 300}),
    distance: varchar('distance', {length: 100}),
    url: varchar('url', {length: 500}),
    race_date: timestamp('race_date', {mode: 'string'}),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow(),
  },
  (race) => {
    return {
      userIdIdx: index('future_race_user_id_idx').on(race.user_id),
    };
  },
);

export const stateStats = pgTable(
  'state_stats',
  {
    id: serial('id').primaryKey(),
    user_id: integer('user_id').notNull(),
    state: varchar('state', {length: 2}).notNull(),
    run_count: integer('run_count').default(0),
    marathon_count: integer('marathon_count').default(0),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow(),
  },
  (stateStats) => {
    return {
      userIdIdx: index('state_stats_user_id_idx').on(stateStats.user_id),
      userStateIdx: uniqueIndex('state_stats_user_state_idx').on(
        stateStats.user_id,
        stateStats.state,
      ),
    };
  },
);

export const streaks = pgTable(
  'streaks',
  {
    id: serial('id').primaryKey(),
    user_id: integer('user_id').notNull(),
    start_date: timestamp('start_date', {mode: 'string'}),
    total_runs: integer('total_runs'),
    total_miles: numeric('total_miles'),
    total_vert: integer('total_vert'),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow(),
  },
  (streak) => {
    return {
      userIdIdx: uniqueIndex('streak_user_id_idx').on(streak.user_id),
    };
  },
);

export const dailyStats = pgTable(
  'daily_stats',
  {
    id: serial('id').primaryKey(),
    user_id: integer('user_id').notNull(),
    date: date('date', {mode: 'string'}).notNull(),
    total_miles: numeric('total_miles'),
    run_count: integer('run_count').default(0),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow(),
  },
  (dailyStats) => {
    return {
      userIdIdx: index('daily_stats_user_id_idx').on(dailyStats.user_id),
      userDateIdx: uniqueIndex('daily_stats_user_date_idx').on(
        dailyStats.user_id,
        dailyStats.date,
      ),
    };
  },
);
