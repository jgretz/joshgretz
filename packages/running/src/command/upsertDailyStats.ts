import {Schema} from 'database';
import type {RunningContainer, UpsertDailyStatsInput} from '../Types';
import {InjectIn} from 'injectx';

const command = ({database}: RunningContainer) => {
  return async (input: UpsertDailyStatsInput) => {
    const [record] = await database
      .insert(Schema.dailyStats)
      .values({
        user_id: input.user_id,
        date: input.date,
        total_miles: input.total_miles ?? '0',
        run_count: input.run_count ?? 0,
      })
      .onConflictDoUpdate({
        target: [Schema.dailyStats.user_id, Schema.dailyStats.date],
        set: {
          total_miles: input.total_miles ?? '0',
          run_count: input.run_count ?? 0,
          updated_at: new Date(),
        },
      })
      .returning();

    return record;
  };
};

export const upsertDailyStats = InjectIn(command);
