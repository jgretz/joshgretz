import {aggregateStatsByState} from '../query/aggregateStatsByState';
import {upsertStateStats} from '../command/upsertStateStats';
import {stateNameToAbbr} from '../constants/us-states';

export const recalculateStateStats = async (userId: number) => {
  const stats = await aggregateStatsByState(userId);

  const results = [];
  for (const row of stats) {
    const abbr = stateNameToAbbr(row.location_state);
    if (!abbr) continue;

    const result = await upsertStateStats({
      user_id: userId,
      state: abbr,
      run_count: row.run_count,
      marathon_count: row.marathon_count,
    });
    results.push(result);
  }

  return results;
};
