// Neon suspends only after 5 minutes without queries, so the runner's 5 s poll of
// /jobs/pending must not reach the database while nothing can be pending.
//
// The recheck only catches jobs this process never marked (manual SQL, or a job enqueued
// on another Fly API machine); restarts are covered by starting open. Each recheck keeps
// Neon awake for at least 5 billed minutes (~75 CU-seconds at 0.25 CU), so a 30-minute
// interval costs ~150 CU-seconds/hour around the clock. Do not shorten it; route new job
// creation through enqueueJob instead.
export const PENDING_JOBS_RECHECK_MS = 120 * 60 * 1000;

export interface PendingJobsGate {
  markMaybePending(): void;
  fetchPending<T>(query: () => Promise<T[]>): Promise<T[]>;
}

export interface PendingJobsGateOptions {
  recheckIntervalMs?: number;
  now?: () => number;
}

export function createPendingJobsGate({
  recheckIntervalMs = PENDING_JOBS_RECHECK_MS,
  now = Date.now,
}: PendingJobsGateOptions = {}): PendingJobsGate {
  // True at start: jobs may have been created before this process existed.
  let maybePending = true;
  let generation = 0;
  let lastQueriedAt = 0;

  return {
    markMaybePending() {
      maybePending = true;
      generation += 1;
    },

    async fetchPending<T>(query: () => Promise<T[]>) {
      if (!maybePending && now() - lastQueriedAt < recheckIntervalMs) {
        return [];
      }

      const startedGeneration = generation;
      lastQueriedAt = now();
      const rows = await query();
      // A mark during the query may belong to a row its snapshot missed.
      maybePending = rows.length > 0 || generation !== startedGeneration;
      return rows;
    },
  };
}
