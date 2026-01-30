import {recalculateDailyStats} from '../api-client';

export interface DailyStatsUpdatePayload {
  user_id: number;
  dates?: string[];
}

export const handleDailyStatsUpdate = async (payload: DailyStatsUpdatePayload) => {
  const {user_id, dates} = payload;

  console.log(`Recalculating daily stats for user ${user_id}${dates ? ` (${dates.length} days)` : ' (full)'}`);

  await recalculateDailyStats(user_id, dates);

  console.log(`Daily stats recalculated for user ${user_id}`);

  return {success: true};
};
