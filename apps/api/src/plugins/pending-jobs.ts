import Elysia from 'elysia';
import {createPendingJobsGate} from '../jobs/pending-jobs-gate';

// One gate per process: every route that creates or requeues a job must flip the
// same flag that /jobs/pending reads.
export const pendingJobsPlugin = new Elysia({name: 'pending-jobs'}).decorate(
  'pendingJobs',
  createPendingJobsGate(),
);
