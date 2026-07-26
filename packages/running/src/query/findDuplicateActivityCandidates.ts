import {Schema} from 'database';
import {and, eq, lt, isNotNull, or, sql} from 'drizzle-orm';
import {alias, type BuildAliasTable} from 'drizzle-orm/pg-core';
import {InjectIn} from 'injectx';
import type {DuplicateActivityCandidate, RunningContainer} from '../Types';

// Two watches recording the same run disagree slightly on start time, distance and GPS, so
// exact equality finds nothing. These tolerances are wide enough to catch that and narrow
// enough that a second real run of the day cannot satisfy both at once: it cannot start
// within ten minutes of a run still in progress *and* cover nearly the same distance.
export const DUPLICATE_MATCH_DEFAULTS = {
  startWindowSeconds: 600, // 10 minutes — two watches started moments apart
  distanceTolerancePct: 5, // 5% of the larger of the two distances
  distanceToleranceMeters: 250, // absolute floor, so short runs are not held to 5% of a small number
} as const;

type Input = {
  userId: number;
  startWindowSeconds?: number;
  distanceTolerancePct?: number;
  distanceToleranceMeters?: number;
};

// The self-join means every helper below is handed an aliased copy of `activities`, whose
// table-name literal differs from the real table's.
type ActivityTable = BuildAliasTable<typeof Schema.activities, string>;

// Not every import carries a local time, so the comparison falls back to UTC. Every Strava
// import sets both, so in practice the two sides are always compared on the same clock; a row
// that somehow had only `start_date` would be off by its UTC offset and simply not match.
const startedAt = (table: ActivityTable) =>
  sql`COALESCE(${table.start_date_local}, ${table.start_date})`;

const hasStartTime = (table: ActivityTable) =>
  or(isNotNull(table.start_date_local), isNotNull(table.start_date));

const side = (table: ActivityTable) => ({
  id: table.id,
  strava_id: table.strava_id,
  name: table.name,
  type: table.type,
  start_date: table.start_date,
  start_date_local: table.start_date_local,
  distance: table.distance,
  moving_time: table.moving_time,
  elapsed_time: table.elapsed_time,
  total_elevation_gain: table.total_elevation_gain,
  average_heartrate: table.average_heartrate,
  gear_id: table.gear_id,
  start_lat: table.start_lat,
  start_lng: table.start_lng,
  location_city: table.location_city,
  location_state: table.location_state,
  location_country: table.location_country,
  featured_marathon: table.featured_marathon,
});

const query = ({database}: RunningContainer) => {
  return async ({
    userId,
    startWindowSeconds = DUPLICATE_MATCH_DEFAULTS.startWindowSeconds,
    distanceTolerancePct = DUPLICATE_MATCH_DEFAULTS.distanceTolerancePct,
    distanceToleranceMeters = DUPLICATE_MATCH_DEFAULTS.distanceToleranceMeters,
  }: Input): Promise<DuplicateActivityCandidate[]> => {
    const a = alias(Schema.activities, 'a');
    const b = alias(Schema.activities, 'b');

    const startDelta = sql<number>`ABS(EXTRACT(EPOCH FROM (${startedAt(a)} - ${startedAt(b)})))::int`;
    const distanceDelta = sql<string>`ABS(${a.distance}::numeric - ${b.distance}::numeric)`;

    return await database
      .select({
        a: side(a),
        b: side(b),
        start_delta_seconds: startDelta.as('start_delta_seconds'),
        distance_delta_meters: distanceDelta.as('distance_delta_meters'),
      })
      .from(a)
      // lt rather than ne so each pair is reported once, not in both orders.
      .innerJoin(b, lt(a.id, b.id))
      .where(
        and(
          eq(a.user_id, userId),
          eq(b.user_id, userId),
          // NULL = NULL is not true, so this also requires both types to be set.
          eq(a.type, b.type),
          hasStartTime(a),
          hasStartTime(b),
          isNotNull(a.distance),
          isNotNull(b.distance),
          sql`${startDelta} <= ${startWindowSeconds}`,
          sql`${distanceDelta} <= GREATEST(${distanceToleranceMeters}::numeric, ${distanceTolerancePct}::numeric / 100 * GREATEST(${a.distance}::numeric, ${b.distance}::numeric))`,
        ),
      )
      .orderBy(sql`LEAST(${startedAt(a)}, ${startedAt(b)}) DESC`);
  };
};

export const findDuplicateActivityCandidates = InjectIn(query);
