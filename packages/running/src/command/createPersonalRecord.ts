import {Schema} from 'database';
import type {RunningContainer, CreatePersonalRecordInput} from '../Types';
import {InjectIn} from 'injectx';
import {findActivityById} from '../query/findActivityById';

const METERS_PER_MILE = 1609.344;

const command = ({database}: RunningContainer) => {
  return async (input: CreatePersonalRecordInput) => {
    let enriched: Partial<CreatePersonalRecordInput> = {};

    if (input.activity_id) {
      const activity = await findActivityById(input.activity_id);
      if (activity) {
        const miles =
          activity.distance ? Number(activity.distance) / METERS_PER_MILE : 0;
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

    const [record] = await database
      .insert(Schema.personalRecords)
      .values({
        user_id: input.user_id,
        title: input.title,
        time_seconds: input.time_seconds,
        activity_id: input.activity_id ?? null,
        ...enriched,
      })
      .returning();

    return record;
  };
};

export const createPersonalRecord = InjectIn(command);
