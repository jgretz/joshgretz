import {Schema} from 'database';
import type {RunningContainer, UpsertStreakInput} from '../Types';
import {InjectIn} from 'injectx';

const command = ({database}: RunningContainer) => {
  return async (input: UpsertStreakInput) => {
    const [record] = await database
      .insert(Schema.streaks)
      .values({
        user_id: input.user_id,
        start_date: input.start_date ?? null,
        total_runs: input.total_runs ?? null,
        total_miles: input.total_miles ?? null,
        total_vert: input.total_vert ?? null,
      })
      .onConflictDoUpdate({
        target: Schema.streaks.user_id,
        set: {
          start_date: input.start_date ?? null,
          total_runs: input.total_runs ?? null,
          total_miles: input.total_miles ?? null,
          total_vert: input.total_vert ?? null,
          updated_at: new Date(),
        },
      })
      .returning();

    return record;
  };
};

export const upsertStreak = InjectIn(command);
