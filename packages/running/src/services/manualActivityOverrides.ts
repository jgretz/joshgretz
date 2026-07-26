import type {
  DuplicateActivityCandidate,
  DuplicateActivitySide,
  ManualActivityOverrides,
  ManualOverrideSource,
} from '../Types';

// The policy for what happens to hand-set values when a duplicate activity is deleted: which
// values a re-import cannot rebuild, how to name them, and which copy inherits them. Pure and
// database-free on purpose — no InjectIn, so the rules can be unit-tested without a container
// and the caller keeps the decision about whether the expensive matcher runs at all.

export const hasGps = (row: ManualOverrideSource): boolean =>
  Boolean(row.start_lat) && Boolean(row.start_lng);

// Only what a re-import genuinely cannot rebuild — the same rule the operator-facing warning in
// `apps/www/src/components/admin/duplicate-pair.tsx` uses. `featured_marathon` is never written
// by mapStravaActivityToRunningActivity, so it is always hand-set. `location_state` usually is
// not: the mapper reverse-geocodes city/state/country from `start_latlng`, so a copy with GPS
// gets its place back on the next import. It is unrecoverable only when there were no
// coordinates to geocode from.
//
// Accepted edge: carrying a state to a survivor that *does* have GPS only holds until that
// survivor's next import, because shouldUpdateLocation re-geocodes once any location field is
// empty or the stored coordinates move. That is not the loss this exists to prevent — a copy
// with GPS can rebuild its own place. The unrecoverable case is both copies lacking GPS, where
// shouldUpdateLocation short-circuits on `!activity.start_latlng?.length` and the carried
// values stand.
export const manualOverridesFor = (row: ManualOverrideSource): ManualActivityOverrides | null => {
  const overrides: ManualActivityOverrides = {};

  if (row.featured_marathon) {
    overrides.featured_marathon = true;
  }

  if (row.location_state && !hasGps(row)) {
    // Empty members are dropped here rather than by the caller: carrying a NULL across would let
    // a hand-set state erase the survivor's correctly geocoded city.
    if (row.location_city) overrides.location_city = row.location_city;
    overrides.location_state = row.location_state;
    if (row.location_country) overrides.location_country = row.location_country;
  }

  return Object.keys(overrides).length > 0 ? overrides : null;
};

export const describeManualOverrides = (overrides: ManualActivityOverrides): string => {
  const parts: string[] = [];

  if (overrides.featured_marathon) parts.push('featured race');
  if (overrides.location_state) parts.push(`state "${overrides.location_state}"`);
  if (overrides.location_city) parts.push(`city "${overrides.location_city}"`);
  if (overrides.location_country) parts.push(`country "${overrides.location_country}"`);

  return parts.join(', ');
};

// Pure: the caller does the querying, because running the matcher at all is a decision about
// cost (it is an O(N²) self-join) that belongs with the caller, not with the selection rule.
// Each pair is reported once with `a.id < b.id`, so the doomed activity can be on either side.
export const chooseSurvivor = (
  candidates: DuplicateActivityCandidate[],
  activityId: number,
): DuplicateActivitySide | null => {
  const [closest] = candidates
    .filter((pair) => pair.a.id === activityId || pair.b.id === activityId)
    .map((pair) => ({
      side: pair.a.id === activityId ? pair.b : pair.a,
      delta: pair.start_delta_seconds,
    }))
    // Deterministic when several copies are in range: nearest start, then lowest id.
    .sort((left, right) => left.delta - right.delta || left.side.id - right.side.id);

  return closest?.side ?? null;
};
