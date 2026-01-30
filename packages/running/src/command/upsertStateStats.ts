import {Schema} from 'database';
import type {RunningContainer, UpsertStateStatsInput} from '../Types';
import {InjectIn} from 'injectx';

const command = ({database}: RunningContainer) => {
  return async (input: UpsertStateStatsInput) => {
    const [record] = await database
      .insert(Schema.stateStats)
      .values({
        user_id: input.user_id,
        state: input.state,
        run_count: input.run_count ?? 0,
        marathon_count: input.marathon_count ?? 0,
        first_marathon_name: input.first_marathon_name ?? null,
        first_marathon_date: input.first_marathon_date ?? null,
        first_marathon_strava_id: input.first_marathon_strava_id ?? null,
      })
      .onConflictDoUpdate({
        target: [Schema.stateStats.user_id, Schema.stateStats.state],
        set: {
          run_count: input.run_count ?? 0,
          marathon_count: input.marathon_count ?? 0,
          first_marathon_name: input.first_marathon_name ?? null,
          first_marathon_date: input.first_marathon_date ?? null,
          first_marathon_strava_id: input.first_marathon_strava_id ?? null,
          updated_at: new Date(),
        },
      })
      .returning();

    return record;
  };
};

export const upsertStateStats = InjectIn(command);
