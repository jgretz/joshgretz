import {parseEnv} from 'env';
import z from 'zod';

const envSchema = z.object({
  API_URL: z.string().default('http://localhost:3001'),
  TASK_API_KEY: z.string(),
  POLL_INTERVAL_MS: z.coerce.number().default(5000),
  // Docker postgres config (optional - uses defaults if not set)
  PGBOSS_CONTAINER_NAME: z.string().optional(),
  PGBOSS_DB_PORT: z.string().optional(),
  PGBOSS_DB_PASSWORD: z.string().optional(),
  // Recovery config (optional)
  RETRY_INTERVAL_MS: z.string().optional(),
  MAX_RETRIES: z.string().optional(),
  // Strava user for token lookups
  STRAVA_USER_ID: z.coerce.number().optional(),
});

export const config = parseEnv(envSchema);
