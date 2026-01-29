import {pgTable, serial, varchar, boolean, uniqueIndex, integer, timestamp} from 'drizzle-orm/pg-core';

export const users = pgTable(
  'users',
  {
    id: serial('id').primaryKey(),
    name: varchar('email', {length: 256}).notNull(),
    email: varchar('email', {length: 256}).notNull(),
    admin: boolean('admin').default(false).notNull(),
  },
  (users) => {
    return {
      emailIndex: uniqueIndex('users_email_idx').on(users.email),
    };
  },
);

export const thirdPartyAccess = pgTable(
  'third_party_access',
  {
    id: serial('id').primaryKey(),
    user_id: integer('user_id').notNull(),

    strava_id: integer('strava_id'),
    strava_access_token: varchar('strava_access_token', {length: 100}),
    strava_code: varchar('strava_code', {length: 50}),
    strava_refresh_token: varchar('strava_refresh_token', {length: 100}),
    strava_token_expires_at: timestamp('strava_token_expires_at'),
  },
  (thirdPartyAccess) => {
    return {
      userIdIndex: uniqueIndex('third_party_access_user_idx').on(thirdPartyAccess.user_id),
    };
  },
);
