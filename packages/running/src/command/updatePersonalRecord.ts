import {Schema} from 'database';
import {eq} from 'drizzle-orm';
import type {RunningContainer, UpdatePersonalRecordInput} from '../Types';
import {InjectIn} from 'injectx';
import {findActivityById} from '../query/findActivityById';

const METERS_PER_MILE = 1609.344;

const command = ({database}: RunningContainer) => {
  return async (id: number, input: UpdatePersonalRecordInput) => {
    let enriched: Partial<UpdatePersonalRecordInput> = {};

    if (input.activity_id !== undefined) {
      if (input.activity_id === null) {
        enriched = {
          distance: null,
          pace_seconds: null,
          race_name: null,
          race_location: null,
          strava_id: null,
          race_date: null,
        };
      } else {
        const activity = await findActivityById(input.activity_id);
        if (activity) {
          const miles =
            activity.distance
              ? Number(activity.distance) / METERS_PER_MILE
              : 0;
          enriched = {
            race_name: activity.name ?? null,
            race_location:
              [activity.location_city, activity.location_state]
                .filter(Boolean)
                .join(', ') || null,
            distance: activity.distance ?? null,
            pace_seconds:
              miles > 0 && activity.moving_time
                ? Math.round(Number(activity.moving_time) / miles)
                : null,
            strava_id: activity.strava_id,
            race_date: activity.start_date_local ?? null,
          };
        }
      }
    }

    const [record] = await database
      .update(Schema.personalRecords)
      .set({
        ...input,
        ...enriched,
        updated_at: new Date(),
      })
      .where(eq(Schema.personalRecords.id, id))
      .returning();

    return record;
  };
};

export const updatePersonalRecord = InjectIn(command);
