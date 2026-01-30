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
      })
      .onConflictDoUpdate({
        target: [Schema.stateStats.user_id, Schema.stateStats.state],
        set: {
          run_count: input.run_count ?? 0,
          marathon_count: input.marathon_count ?? 0,
          updated_at: new Date(),
        },
      })
      .returning();

    return record;
  };
};

export const upsertStateStats = InjectIn(command);
