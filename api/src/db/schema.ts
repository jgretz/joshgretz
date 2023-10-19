import {
  pgTable,
  integer,
  serial,
  varchar,
  boolean,
  decimal,
  date,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

export const users = pgTable(
  'users',
  {
    id: serial('id').primaryKey(),
    email: varchar('email', {length: 256}).notNull(),
    admin: boolean('admin').default(false).notNull(),
  },
  (users) => {
    return {
      emailIndex: uniqueIndex('email_idx').on(users.email),
    };
  },
);

export const tokens = pgTable('tokens', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  strava: varchar('strava', {length: 500}),
});

export const stravaActivities = pgTable('strava_activities', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  name: varchar('name', {length: 300}),
  type: varchar('type', {length: 50}),
  distance: decimal('distance'),
  movingTime: decimal('moving_time'),
  elapsedTime: decimal('elapsed_time'),
  elevationGain: decimal('elevation_gain'),
  startDate: date('start_date'),
  latitude: decimal('latitude'),
  longitude: decimal('longitude'),
  city: varchar('city', {length: 100}),
  state: varchar('state', {length: 100}),
  country: varchar('country', {length: 100}),
});
