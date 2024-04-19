// drizzle.config.ts
import type {Config} from 'drizzle-kit';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL,
  },
} satisfies Config;
