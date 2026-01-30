import {sql} from 'drizzle-orm';
import type {RunningContainer} from '../Types';
import {InjectIn} from 'injectx';

export type FirstMarathonByState = {
  location_state: string;
  name: string;
  start_date: string;
  strava_id: string;
};

const query = ({database}: RunningContainer) => {
  return async (userId: number): Promise<FirstMarathonByState[]> => {
    const rows = await database.execute(sql`
      SELECT DISTINCT ON (location_state)
        location_state, name, start_date, strava_id
      FROM activities
      WHERE user_id = ${userId}
        AND type = 'Run'
        AND distance::numeric >= 42195
        AND location_state IS NOT NULL
      ORDER BY location_state, featured_marathon DESC, start_date ASC
    `);

    return rows as unknown as FirstMarathonByState[];
  };
};

export const findFirstMarathonsByState = InjectIn(query);
