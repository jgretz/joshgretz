import {aggregateDailyStats} from '../query/aggregateDailyStats';
import {upsertDailyStats} from '../command/upsertDailyStats';

const nextDay = (date: string): string => {
  const next = new Date(`${date}T00:00:00Z`);
  next.setUTCDate(next.getUTCDate() + 1);
  return next.toISOString().slice(0, 10);
};

// An overnight activity contributes miles to the day after it starts, so recalculating a
// day is only correct if its successor is recalculated alongside it.
const withFollowingDays = (dates: string[]): string[] => [
  ...new Set(dates.flatMap((date) => [date, nextDay(date)])),
];

export const recalculateDailyStats = async (userId: number, dates?: string[]) => {
  const targetDates = dates?.length ? withFollowingDays(dates) : undefined;
  const stats = await aggregateDailyStats(userId, targetDates);

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

  // a targeted day left with no activity (deleted or re-dated) must be zeroed, otherwise
  // its stale row survives the recalculation
  const aggregated = new Set(stats.map((row) => row.date));
  const emptied = targetDates?.filter((date) => !aggregated.has(date)) ?? [];
  for (const date of emptied) {
    const result = await upsertDailyStats({
      user_id: userId,
      date,
      total_miles: '0',
      run_count: 0,
    });
    results.push(result);
  }

  return results;
};
