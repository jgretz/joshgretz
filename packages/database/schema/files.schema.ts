import {
  customType,
  integer,
  pgTable,
  serial,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';

// Drizzle has no native bytea; store raw file bytes as a Buffer.
const bytea = customType<{data: Buffer; default: false}>({
  dataType() {
    return 'bytea';
  },
});

export const files = pgTable(
  'files',
  {
    id: serial('id').primaryKey(),
    slug: varchar('slug', {length: 300}).notNull(),
    original_filename: varchar('original_filename', {length: 300}).notNull(),
    mime_type: varchar('mime_type', {length: 100}).notNull(),
    size_bytes: integer('size_bytes').notNull(),
    data: bytea('data').notNull(),
    created_at: timestamp('created_at', {mode: 'string'}).defaultNow(),
    updated_at: timestamp('updated_at', {mode: 'string'}).defaultNow(),
  },
  (files) => {
    return {
      slugIdx: uniqueIndex('files_slug_idx').on(files.slug),
    };
  },
);
