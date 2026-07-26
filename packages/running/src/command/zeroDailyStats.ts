import {Schema} from 'database';
import {and, eq, inArray} from 'drizzle-orm';
import type {RunningContainer} from '../Types';
import {InjectIn} from 'injectx';

// Update-only on purpose. Recalculating a date has to clear a day whose activities were all
// deleted, but a day that never had a row must stay absent — upserting here would invent a
// zero row for every day that merely got swept in as a potential overnight continuation.
const command = ({database}: RunningContainer) => {
  return async (userId: number, dates: string[]) => {
    if (dates.length === 0) return [];

    return await database
      .update(Schema.dailyStats)
      .set({total_miles: '0', run_count: 0, updated_at: new Date()})
      .where(and(eq(Schema.dailyStats.user_id, userId), inArray(Schema.dailyStats.date, dates)))
      .returning();
  };
};

export const zeroDailyStats = InjectIn(command);
