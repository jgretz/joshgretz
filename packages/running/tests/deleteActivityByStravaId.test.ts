import {describe, it, expect, beforeEach, afterEach, mock} from 'bun:test';
import {GetContainer} from 'injectx';
import {PgDialect} from 'drizzle-orm/pg-core';
import type {SQL} from 'drizzle-orm';
import {deleteActivityByStravaId} from '../src/command/deleteActivityByStravaId';
import type {DuplicateActivityCandidate} from '../src/Types';
import {makePair} from './helpers/duplicateCandidates';

type FoundActivity = {
  id: number;
  start_date_local: string | null;
  user_id?: number;
  name?: string | null;
  strava_id?: string;
  start_lat?: string | null;
  start_lng?: string | null;
  location_city?: string | null;
  location_state?: string | null;
  location_country?: string | null;
  featured_marathon?: boolean | null;
};
type UpdatePayload = Record<string, unknown>;
type RecordedUpdate = {payload: UpdatePayload; where: SQL};

// Conditions are opaque objects until compiled; render them so assertions read as SQL.
const renderCondition = (condition: SQL) => new PgDialect().sqlToQuery(condition);

// `findDuplicateActivityCandidates` is reached through the container rather than mock.module:
// bun runs test files alphabetically, so a registration here would contaminate the real static
// import in findDuplicateActivityCandidates.test.ts.
function makeMockDatabase(activity?: FoundActivity, candidates: DuplicateActivityCandidate[] = []) {
  const updates: RecordedUpdate[] = [];
  const deletes: SQL[] = [];

  const tx = {
    update: mock(() => ({
      set: mock((payload: UpdatePayload) => ({
        where: mock(async (where: SQL) => {
          updates.push({payload, where});
        }),
      })),
    })),
    delete: mock(() => ({
      where: mock(async (where: SQL) => {
        deletes.push(where);
      }),
    })),
  };

  const database = {
    query: {activities: {findFirst: mock(async () => activity)}},
    transaction: mock(async (callback: (tx: unknown) => Promise<void>) => callback(tx)),
    // The duplicate matcher is a quadratic self-join, so it must not run for an ordinary delete.
    select: mock(() => ({
      from: () => ({
        innerJoin: () => ({
          where: () => ({
            orderBy: async () => candidates,
          }),
        }),
      }),
    })),
    // The activity delete and the personal record unlink must be atomic, so neither may
    // run against the outer connection.
    update: mock(() => {
      throw new Error('update must run inside the transaction');
    }),
    delete: mock(() => {
      throw new Error('delete must run inside the transaction');
    }),
  };

  return {database, updates, deletes};
}

describe('deleteActivityByStravaId', function () {
  beforeEach(function () {
    GetContainer().dependencies.clear();
  });

  it('should return null and change nothing when no activity matches the strava id', async function () {
    const {database, updates, deletes} = makeMockDatabase();
    GetContainer().Bind(database, {name: 'database'});

    const result = await deleteActivityByStravaId('9999');

    expect(result).toBeNull();
    expect(database.transaction).not.toHaveBeenCalled();
    expect(updates).toHaveLength(0);
    expect(deletes).toHaveLength(0);
  });

  it('should unlink personal records and delete the activity inside one transaction', async function () {
    const {database, updates, deletes} = makeMockDatabase({
      id: 42,
      start_date_local: '2026-07-04T07:00:00',
    });
    GetContainer().Bind(database, {name: 'database'});

    const result = await deleteActivityByStravaId('123');

    expect(result).toBe('2026-07-04T07:00:00');
    expect(database.transaction).toHaveBeenCalledTimes(1);
    expect(updates).toHaveLength(1);
    expect(renderCondition(deletes[0]!).params).toEqual(['123']);
  });

  it('should match personal records by either the activity id or the strava id', async function () {
    const {database, updates} = makeMockDatabase({id: 42, start_date_local: null});
    GetContainer().Bind(database, {name: 'database'});

    await deleteActivityByStravaId('123');

    const {sql, params} = renderCondition(updates[0]!.where);
    expect(sql).toBe(
      '("personal_records"."activity_id" = $1 or "personal_records"."strava_id" = $2)',
    );
    expect(params).toEqual([42, '123']);
  });

  it('should null only the activity references and keep the denormalized race fields', async function () {
    const {database, updates} = makeMockDatabase({id: 42, start_date_local: null});
    GetContainer().Bind(database, {name: 'database'});

    await deleteActivityByStravaId('123');

    expect(updates[0]!.payload).toMatchObject({activity_id: null, strava_id: null});
    expect(Object.keys(updates[0]!.payload).sort()).toEqual([
      'activity_id',
      'strava_id',
      'updated_at',
    ]);
  });

  // Every Strava delete webhook comes through this command, and the matcher is O(N²) — ~1.3s at
  // 4,000 activities. A row with nothing hand-set must not pay for it.
  it('should not run the duplicate matcher when the row carries no manual overrides', async function () {
    const {database, updates, deletes} = makeMockDatabase({
      id: 42,
      user_id: 1,
      start_date_local: '2026-07-04T07:00:00',
      start_lat: '43.6',
      start_lng: '-72.6',
      location_state: 'Vermont',
    });
    GetContainer().Bind(database, {name: 'database'});

    await deleteActivityByStravaId('123');

    expect(database.select).not.toHaveBeenCalled();
    expect(updates).toHaveLength(1);
    expect(deletes).toHaveLength(1);
  });

  it('should carry a featured race flag to the surviving copy inside the transaction', async function () {
    const {database, updates} = makeMockDatabase(
      {
        id: 42,
        user_id: 1,
        name: 'Vermont 100',
        strava_id: '123',
        start_date_local: '2026-07-18T04:00:05',
        start_lat: '43.6',
        start_lng: '-72.6',
        featured_marathon: true,
      },
      [makePair(42, 77)],
    );
    GetContainer().Bind(database, {name: 'database'});

    await deleteActivityByStravaId('123');

    const {sql, params} = renderCondition(updates[0]!.where);
    expect(sql).toBe('"activities"."id" = $1');
    expect(params).toEqual([77]);
    expect(updates[0]!.payload).toEqual({featured_marathon: true});
  });

  it('should carry a hand-set location without blanking fields the deleted copy left empty', async function () {
    const {database, updates} = makeMockDatabase(
      {
        id: 42,
        user_id: 1,
        name: 'Vermont 100',
        strava_id: '123',
        start_date_local: '2026-07-18T04:00:05',
        location_state: 'Vermont',
      },
      [makePair(77, 42)],
    );
    GetContainer().Bind(database, {name: 'database'});

    await deleteActivityByStravaId('123');

    expect(renderCondition(updates[0]!.where).params).toEqual([77]);
    expect(updates[0]!.payload).toEqual({location_state: 'Vermont'});
  });

  describe('when no duplicate can take the overrides', function () {
    const original = console.warn;
    let warnings: string[] = [];

    beforeEach(function () {
      warnings = [];
      console.warn = (message: string) => {
        warnings.push(message);
      };
    });

    afterEach(function () {
      console.warn = original;
    });

    it('should name the activity and every value it is destroying', async function () {
      const {database, updates} = makeMockDatabase({
        id: 42,
        user_id: 1,
        name: 'Vermont 100',
        strava_id: '123',
        start_date_local: '2026-07-18T04:00:05',
        location_state: 'Vermont',
        featured_marathon: true,
      });
      GetContainer().Bind(database, {name: 'database'});

      const result = await deleteActivityByStravaId('123');

      expect(warnings).toHaveLength(1);
      expect(warnings[0]).toContain('Vermont 100');
      expect(warnings[0]).toContain('#42');
      expect(warnings[0]).toContain('featured race');
      expect(warnings[0]).toContain('state "Vermont"');
      // The delete still goes through — warning and proceeding, not refusing.
      expect(result).toBe('2026-07-18T04:00:05');
      expect(updates).toHaveLength(1);
    });
  });
});
