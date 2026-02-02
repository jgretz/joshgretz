import {Schema} from 'database';
import {eq} from 'drizzle-orm';
import type {RunningContainer} from '../Types';
import {InjectIn} from 'injectx';

const command = ({database}: RunningContainer) => {
  return async (stravaId: string): Promise<string | null> => {
    const activity = await database.query.activities.findFirst({
      where: eq(Schema.activities.strava_id, stravaId),
      columns: {start_date_local: true},
    });

    if (!activity) return null;

    await database.delete(Schema.activities).where(eq(Schema.activities.strava_id, stravaId));

    return activity.start_date_local ?? null;
  };
};

export const deleteActivityByStravaId = InjectIn(command);
