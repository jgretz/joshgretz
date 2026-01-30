import {aggregateStatsByState} from '../query/aggregateStatsByState';
import {findFirstMarathonsByState} from '../query/findFirstMarathonsByState';
import {upsertStateStats} from '../command/upsertStateStats';
import {stateNameToAbbr} from '../constants/us-states';
import type {FirstMarathonByState} from '../query/findFirstMarathonsByState';

export const recalculateStateStats = async (userId: number) => {
  const [stats, firstMarathons] = await Promise.all([
    aggregateStatsByState(userId),
    findFirstMarathonsByState(userId),
  ]);

  const marathonMap = new Map<string, FirstMarathonByState>();
  for (const m of firstMarathons) {
    const abbr = stateNameToAbbr(m.location_state);
    if (abbr) marathonMap.set(abbr, m);
  }

  const results = [];
  for (const row of stats) {
    const abbr = stateNameToAbbr(row.location_state);
    if (!abbr) continue;

    const first = marathonMap.get(abbr);
    const result = await upsertStateStats({
      user_id: userId,
      state: abbr,
      run_count: row.run_count,
      marathon_count: row.marathon_count,
      first_marathon_name: first?.name ?? null,
      first_marathon_date: first?.start_date ?? null,
      first_marathon_strava_id: first?.strava_id ?? null,
    });
    results.push(result);
  }

  return results;
};
