import {recalculateStateStats} from '../api-client';

export interface StateStatsUpdatePayload {
  user_id: number;
}

export const handleStateStatsUpdate = async (payload: StateStatsUpdatePayload) => {
  const {user_id} = payload;

  console.log(`Recalculating state stats for user ${user_id}`);

  await recalculateStateStats(user_id);

  console.log(`State stats recalculated for user ${user_id}`);

  return {success: true};
};
