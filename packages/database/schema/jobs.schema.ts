import {pgTable, serial, varchar, jsonb, text, timestamp, index} from 'drizzle-orm/pg-core';

export const jobs = pgTable(
  'jobs',
  {
    id: serial('id').primaryKey(),
    type: varchar('type', {length: 50}).notNull(),
    status: varchar('status', {length: 20}).notNull().default('pending'),
    payload: jsonb('payload').notNull(),
    result: jsonb('result'),
    error_message: text('error_message'),
    created_at: timestamp('created_at').notNull().defaultNow(),
    started_at: timestamp('started_at'),
    completed_at: timestamp('completed_at'),
  },
  (t) => ({
    statusIdx: index('jobs_status_idx').on(t.status),
    typeIdx: index('jobs_type_idx').on(t.type),
  }),
);
