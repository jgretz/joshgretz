import {Schema, type Database} from 'database';
import type {PendingJobsGate} from './pending-jobs-gate';

export interface NewJob {
  type: string;
  payload: unknown;
}

export async function enqueueJob(
  database: Database,
  pendingJobs: PendingJobsGate,
  {type, payload}: NewJob,
): Promise<{id: number}> {
  const [job] = await database
    .insert(Schema.jobs)
    .values({type, payload})
    .returning({id: Schema.jobs.id});
  pendingJobs.markMaybePending();
  return job;
}
