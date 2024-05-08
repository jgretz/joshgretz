import {pgTable, serial, varchar, boolean, uniqueIndex} from 'drizzle-orm/pg-core';

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
      emailIndex: uniqueIndex('email_idx').on(users.email),
    };
  },
);
