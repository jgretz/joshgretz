import {defineConfig} from 'drizzle-kit';

export default defineConfig({
  schema: ['../packages/running/src/schema.ts', '../packages/users/src/schema.ts'],
  dialect: 'postgresql',
  out: './drizzle/',
  dbCredentials: {
    url: process.env.DATABASE_URL || '',
  },
  verbose: true,
  strict: true,
});
