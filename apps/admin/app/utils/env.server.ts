import {parseEnv} from 'env';
import z from 'zod';

function pick<Data extends object, Keys extends keyof Data>(
  data: Data,
  keys: Keys[],
): Pick<Data, Keys> {
  const result = {} as Pick<Data, Keys>;

  for (const key of keys) {
    result[key] = data[key];
  }

  return result;
}

// server env - should be everything in the .env file
const serverEnvSchema = z.object({
  JOSHGRETZ_API_URL: z.string(),
  JOSHGRETZ_API_TOKEN: z.string(),
});

export const serverEnv = parseEnv(serverEnvSchema);

// client env - everything that will be exposed to the client
// ** DO NOT INCLUDE SENSITIVE INFORMATION HERE **
export function getClientEnv() {
  return pick(serverEnv, ['JOSHGRETZ_API_URL', 'JOSHGRETZ_API_TOKEN']);
}
