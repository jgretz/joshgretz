import {aggregateStatsByState} from '../query/aggregateStatsByState';
import {findFirstMarathonsByState} from '../query/findFirstMarathonsByState';
import {upsertStateStats} from '../command/upsertStateStats';
import {stateNameToAbbr} from '../constants/us-states';
import type {FirstMarathonByState} from '../query/findFirstMarathonsByState';

type StateTotals = {
  run_count: number;
  marathon_count: number;
};

// Both queries group on the raw location_state text, so a state spelled more than one way
// ("Vermont" from geocoding, "VT" typed by hand) arrives as separate rows. Fold them on the
// abbreviation, otherwise the last upsert for a state silently discards the others.
const totalsByState = (
  stats: Awaited<ReturnType<typeof aggregateStatsByState>>,
): Map<string, StateTotals> =>
  stats.reduce((totals, row) => {
    const abbr = stateNameToAbbr(row.location_state);
    if (!abbr) return totals;

    const current = totals.get(abbr);
    return totals.set(abbr, {
      run_count: (current?.run_count ?? 0) + Number(row.run_count),
      marathon_count: (current?.marathon_count ?? 0) + Number(row.marathon_count),
    });
  }, new Map<string, StateTotals>());

// An explicitly featured race always wins; otherwise the earliest one represents the state.
const preferredMarathon = (
  current: FirstMarathonByState | undefined,
  candidate: FirstMarathonByState,
): FirstMarathonByState => {
  if (!current) return candidate;
  if (Boolean(candidate.featured_marathon) !== Boolean(current.featured_marathon)) {
    return candidate.featured_marathon ? candidate : current;
  }
  return candidate.start_date < current.start_date ? candidate : current;
};

const marathonsByState = (marathons: FirstMarathonByState[]): Map<string, FirstMarathonByState> =>
  marathons.reduce((byState, marathon) => {
    const abbr = stateNameToAbbr(marathon.location_state);
    if (!abbr) return byState;

    return byState.set(abbr, preferredMarathon(byState.get(abbr), marathon));
  }, new Map<string, FirstMarathonByState>());

export const recalculateStateStats = async (userId: number) => {
  const [stats, firstMarathons] = await Promise.all([
    aggregateStatsByState(userId),
    findFirstMarathonsByState(userId),
  ]);

  const totals = totalsByState(stats);
  const marathonMap = marathonsByState(firstMarathons);

  const results = [];
  for (const [abbr, total] of totals) {
    const first = marathonMap.get(abbr);
    const result = await upsertStateStats({
      user_id: userId,
      state: abbr,
      run_count: total.run_count,
      marathon_count: total.marathon_count,
      first_marathon_name: first?.name ?? null,
      first_marathon_date: first?.start_date ?? null,
      first_marathon_strava_id: first?.strava_id ?? null,
    });
    results.push(result);
  }

  return results;
};
