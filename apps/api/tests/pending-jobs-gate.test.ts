import {describe, it, expect, beforeEach, mock} from 'bun:test';
import {createPendingJobsGate, type PendingJobsGate} from '../src/jobs/pending-jobs-gate';

const RECHECK_MS = 1000;

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>(function (res) {
    resolve = res;
  });
  return {promise, resolve};
}

describe('pendingJobsGate', function () {
  let t: number;
  let gate: PendingJobsGate;

  beforeEach(function () {
    t = 0;
    gate = createPendingJobsGate({recheckIntervalMs: RECHECK_MS, now: () => t});
  });

  async function drain() {
    await gate.fetchPending(async () => []);
  }

  it('should query on the first fetch after process start', async function () {
    const query = mock(async () => [{id: 1}]);

    const rows = await gate.fetchPending(query);

    expect(query).toHaveBeenCalledTimes(1);
    expect(rows).toEqual([{id: 1}]);
  });

  it('should skip the query after an empty result', async function () {
    await drain();
    const query = mock(async () => [{id: 1}]);

    const rows = await gate.fetchPending(query);

    expect(query).not.toHaveBeenCalled();
    expect(rows).toEqual([]);
  });

  it('should query again after markMaybePending', async function () {
    await drain();
    gate.markMaybePending();
    const query = mock(async () => [{id: 2}]);

    const rows = await gate.fetchPending(query);

    expect(query).toHaveBeenCalledTimes(1);
    expect(rows).toEqual([{id: 2}]);
  });

  it('should keep querying while rows are returned until a result is empty', async function () {
    const results = [[{id: 1}], [{id: 1}], [{id: 1}], []];
    const query = mock(async () => results.shift() ?? []);

    for (let i = 0; i < 4; i++) {
      await gate.fetchPending(query);
    }
    await gate.fetchPending(query);

    expect(query).toHaveBeenCalledTimes(4);
  });

  it('should recheck exactly once when the recheck interval elapses', async function () {
    await drain();
    const query = mock(async () => []);

    t = RECHECK_MS - 1;
    await gate.fetchPending(query);
    expect(query).not.toHaveBeenCalled();

    t = RECHECK_MS;
    await gate.fetchPending(query);
    expect(query).toHaveBeenCalledTimes(1);

    await gate.fetchPending(query);
    expect(query).toHaveBeenCalledTimes(1);
  });

  it('should stay open when marked while a query is in flight', async function () {
    const inFlight = deferred<never[]>();
    const pending = gate.fetchPending(() => inFlight.promise);

    gate.markMaybePending();
    inFlight.resolve([]);
    await pending;

    const query = mock(async () => [{id: 3}]);
    const rows = await gate.fetchPending(query);

    expect(query).toHaveBeenCalledTimes(1);
    expect(rows).toEqual([{id: 3}]);
  });

  it('should propagate a query error and query again on the next fetch', async function () {
    await drain();
    gate.markMaybePending();
    const error = new Error('connection refused');

    await expect(
      gate.fetchPending(async () => {
        throw error;
      }),
    ).rejects.toBe(error);

    const query = mock(async () => []);
    await gate.fetchPending(query);
    expect(query).toHaveBeenCalledTimes(1);
  });
});
