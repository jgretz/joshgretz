import {recalculateStreak} from '../api-client';

export interface StreakUpdatePayload {
  user_id: number;
}

export const handleStreakUpdate = async (payload: StreakUpdatePayload) => {
  const {user_id} = payload;

  console.log(`Recalculating streak for user ${user_id}`);

  await recalculateStreak(user_id);

  console.log(`Streak recalculated for user ${user_id}`);

  return {success: true};
};
