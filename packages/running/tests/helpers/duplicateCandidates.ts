import type {DuplicateActivityCandidate, DuplicateActivitySide} from '../../src/Types';

// Only `id` varies in the assertions below — survivor selection reads nothing else off a side —
// so the rest is realistic filler for one of the two Vermont 100 recordings.
export const makeSide = (id: number): DuplicateActivitySide => ({
  id,
  strava_id: `s${id}`,
  name: `activity ${id}`,
  type: 'Run',
  start_date: null,
  start_date_local: '2026-07-18T04:00:05',
  distance: '158089',
  moving_time: null,
  elapsed_time: null,
  total_elevation_gain: null,
  average_heartrate: null,
  gear_id: null,
  start_lat: null,
  start_lng: null,
  location_city: null,
  location_state: null,
  location_country: null,
  featured_marathon: false,
});

export const makePair = (
  aId: number,
  bId: number,
  start_delta_seconds = 240,
): DuplicateActivityCandidate => ({
  a: makeSide(aId),
  b: makeSide(bId),
  start_delta_seconds,
  distance_delta_meters: '60',
});
