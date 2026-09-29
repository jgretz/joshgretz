import {describe, it, expect, mock} from 'bun:test';
import type {Database} from 'database';
import {enqueueJob} from '../src/jobs/enqueue-job';
import {createPendingJobsGate} from '../src/jobs/pending-jobs-gate';

function makeMockDatabase(returning: () => Promise<{id: number}[]>) {
  const values = mock(() => ({returning: mock(returning)}));
  const database = {insert: mock(() => ({values}))};
  return {database: database as unknown as Database, values};
}

async function drainedGate() {
  const gate = createPendingJobsGate();
  await gate.fetchPending(async () => []);
  return gate;
}

describe('enqueueJob', function () {
  it('should insert the type and payload and return the new id', async function () {
    const {database, values} = makeMockDatabase(async () => [{id: 42}]);
    const job = {type: 'activity-import', payload: {user_id: 1, activity_id: 7}};

    const result = await enqueueJob(database, await drainedGate(), job);

    expect(values).toHaveBeenCalledWith(job);
    expect(result).toEqual({id: 42});
  });

  it('should reopen a drained gate', async function () {
    const {database} = makeMockDatabase(async () => [{id: 42}]);
    const gate = await drainedGate();

    await enqueueJob(database, gate, {type: 'files-cleanup', payload: {}});

    const query = mock(async () => [{id: 42}]);
    await gate.fetchPending(query);
    expect(query).toHaveBeenCalledTimes(1);
  });

  it('should reject when the insert fails', async function () {
    const error = new Error('insert failed');
    const {database} = makeMockDatabase(async () => {
      throw error;
    });

    await expect(
      enqueueJob(database, await drainedGate(), {type: 'files-cleanup', payload: {}}),
    ).rejects.toBe(error);
  });
});
