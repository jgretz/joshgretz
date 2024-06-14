import {defineConfig} from 'drizzle-kit';

export default defineConfig({
  schema: ['./schema/running.schema.ts', './schema/user.schema.ts'],
  dialect: 'postgresql',
  out: './drizzle/',
  dbCredentials: {
    url: process.env.DATABASE_URL || '',
  },
  verbose: true,
  strict: true,
});
