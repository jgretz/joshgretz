import {describe, it, expect, beforeEach, mock} from 'bun:test';
import {GetContainer} from 'injectx';
import {deleteActivityByStravaId} from '../src/command/deleteActivityByStravaId';

type FoundActivity = {id: number; start_date_local: string | null};

function makeMockDatabase(activity?: FoundActivity) {
  const setPayloads: Record<string, unknown>[] = [];

  const tx = {
    update: mock(() => ({
      set: mock((payload: Record<string, unknown>) => {
        setPayloads.push(payload);
        return {where: mock(async () => undefined)};
      }),
    })),
    delete: mock(() => ({where: mock(async () => undefined)})),
  };

  const database = {
    query: {activities: {findFirst: mock(async () => activity)}},
    transaction: mock(async (callback: (tx: unknown) => Promise<void>) => callback(tx)),
    update: mock(() => {
      throw new Error('update must run inside the transaction');
    }),
    delete: mock(() => {
      throw new Error('delete must run inside the transaction');
    }),
  };

  return {database, tx, setPayloads};
}

describe('deleteActivityByStravaId', function () {
  beforeEach(function () {
    GetContainer().dependencies.clear();
  });

  it('should return null and delete nothing when no activity matches the strava id', async function () {
    const {database, tx} = makeMockDatabase(undefined);
    GetContainer().Bind(database, {name: 'database'});

    const result = await deleteActivityByStravaId('9999');

    expect(result).toBeNull();
    expect(database.transaction).not.toHaveBeenCalled();
    expect(tx.delete).not.toHaveBeenCalled();
    expect(tx.update).not.toHaveBeenCalled();
  });

  it('should unlink personal records and delete the activity inside one transaction', async function () {
    const {database, tx} = makeMockDatabase({id: 42, start_date_local: '2026-07-04T07:00:00'});
    GetContainer().Bind(database, {name: 'database'});

    const result = await deleteActivityByStravaId('123');

    expect(result).toBe('2026-07-04T07:00:00');
    expect(database.transaction).toHaveBeenCalledTimes(1);
    expect(tx.update).toHaveBeenCalledTimes(1);
    expect(tx.delete).toHaveBeenCalledTimes(1);
  });

  it('should null only the activity references and keep the denormalized race fields', async function () {
    const {database, setPayloads} = makeMockDatabase({id: 42, start_date_local: null});
    GetContainer().Bind(database, {name: 'database'});

    await deleteActivityByStravaId('123');

    expect(setPayloads).toHaveLength(1);
    expect(setPayloads[0]).toMatchObject({activity_id: null, strava_id: null});
    expect(Object.keys(setPayloads[0]!).sort()).toEqual(['activity_id', 'strava_id', 'updated_at']);
  });
});
