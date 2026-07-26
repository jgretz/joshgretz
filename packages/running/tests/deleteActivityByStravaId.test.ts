import {describe, it, expect, beforeEach, mock} from 'bun:test';
import {GetContainer} from 'injectx';
import {PgDialect} from 'drizzle-orm/pg-core';
import type {SQL} from 'drizzle-orm';
import {deleteActivityByStravaId} from '../src/command/deleteActivityByStravaId';

type FoundActivity = {id: number; start_date_local: string | null};
type UpdatePayload = Record<string, unknown>;
type RecordedUpdate = {payload: UpdatePayload; where: SQL};

// Conditions are opaque objects until compiled; render them so assertions read as SQL.
const renderCondition = (condition: SQL) => new PgDialect().sqlToQuery(condition);

function makeMockDatabase(activity?: FoundActivity) {
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
});
