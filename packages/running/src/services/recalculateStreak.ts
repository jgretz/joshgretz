import {findStreakByUserId} from '../query/findStreakByUserId';
import {aggregateStreakStats} from '../query/aggregateStreakStats';
import {upsertStreak} from '../command/upsertStreak';

export const recalculateStreak = async (userId: number) => {
  const streak = await findStreakByUserId(userId);
  if (!streak?.start_date) return null;

  const stats = await aggregateStreakStats(userId, streak.start_date);

  return await upsertStreak({
    user_id: userId,
    start_date: streak.start_date,
    total_runs: stats.total_runs,
    total_miles: stats.total_miles,
    total_vert: stats.total_vert,
  });
};
