import {sql} from 'drizzle-orm';
import type {RunningContainer} from '../Types';
import {InjectIn} from 'injectx';

export type FirstMarathonByState = {
  location_state: string;
  name: string;
  start_date: string;
  strava_id: string;
  featured_marathon: boolean | null;
};

const query = ({database}: RunningContainer) => {
  return async (userId: number): Promise<FirstMarathonByState[]> => {
    const rows = await database.execute(sql`
      SELECT DISTINCT ON (location_state)
        location_state, name, start_date, strava_id, featured_marathon
      FROM activities
      WHERE user_id = ${userId}
        AND type = 'Run'
        AND distance::numeric >= 42195
        AND location_state IS NOT NULL
      -- DESC alone sorts NULLs first, which would rank a never-set flag above a featured race
      ORDER BY location_state, featured_marathon DESC NULLS LAST, start_date ASC
    `);

    return rows as unknown as FirstMarathonByState[];
  };
};

export const findFirstMarathonsByState = InjectIn(query);
