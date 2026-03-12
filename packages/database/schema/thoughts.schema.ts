import {pgTable, serial, varchar, text, timestamp, uniqueIndex} from 'drizzle-orm/pg-core';

export const thoughts = pgTable(
  'thoughts',
  {
    id: serial('id').primaryKey(),
    title: varchar('title', {length: 300}).notNull(),
    slug: varchar('slug', {length: 300}).notNull(),
    content: text('content').notNull(),
    description: varchar('description', {length: 500}),
    tags: text('tags').array(),
    published_at: timestamp('published_at', {mode: 'string'}),
    created_at: timestamp('created_at', {mode: 'string'}).defaultNow(),
    updated_at: timestamp('updated_at', {mode: 'string'}).defaultNow(),
  },
  (thoughts) => {
    return {
      slugIdx: uniqueIndex('thoughts_slug_idx').on(thoughts.slug),
    };
  },
);
