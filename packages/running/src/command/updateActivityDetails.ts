import {Schema} from 'database';
import {eq} from 'drizzle-orm';
import type {RunningContainer, UpdateActivityDetailsInput} from '../Types';
import {InjectIn} from 'injectx';

// Strava does not always return coordinates for an activity (large FIT uploads can arrive
// with an empty start_latlng), which leaves reverse geocoding with nothing to work from.
// This is the manual override so such an activity can still be attributed to a state and
// nominated as that state's featured race.
const command = ({database}: RunningContainer) => {
  return async (id: number, input: UpdateActivityDetailsInput) => {
    const [record] = await database
      .update(Schema.activities)
      .set(input)
      .where(eq(Schema.activities.id, id))
      .returning();

    return record;
  };
};

export const updateActivityDetails = InjectIn(command);
