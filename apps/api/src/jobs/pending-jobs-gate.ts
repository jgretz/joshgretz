// Neon suspends only after 5 minutes without queries, so the runner's 5 s poll of
// /jobs/pending must not reach the database while nothing can be pending.
export const PENDING_JOBS_RECHECK_MS = 30 * 60 * 1000;

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
