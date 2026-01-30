import {aggregateDailyStats} from '../query/aggregateDailyStats';
import {upsertDailyStats} from '../command/upsertDailyStats';

export const recalculateDailyStats = async (userId: number, dates?: string[]) => {
  const stats = await aggregateDailyStats(userId, dates);

  const results = [];
  for (const row of stats) {
    const result = await upsertDailyStats({
      user_id: userId,
      date: row.date,
      total_miles: row.total_miles,
      run_count: row.run_count,
    });
    results.push(result);
  }

  return results;
};
