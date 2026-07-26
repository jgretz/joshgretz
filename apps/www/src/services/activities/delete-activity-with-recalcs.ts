// Deleting an activity and rebuilding the aggregates is one operation. The API delete route
// only removes the row, so whoever calls it has to enqueue the recalcs — a delete without them
// leaves the streak, state and daily aggregates permanently counting an activity that no longer
// exists, which is exactly the failure this admin view exists to correct.

type Env = {
  apiUrl: string;
  apiToken: string;
};

type PostDeleteJob = {
  type: string;
  buildPayload: (userId: number, date: string) => unknown;
};

// The same three jobs apps/tasks/src/services/post-import-jobs.ts schedules after an import or
// a webhook delete.
const POST_DELETE_JOBS: PostDeleteJob[] = [
  {type: 'streak-update', buildPayload: (userId) => ({user_id: userId})},
  {type: 'state-stats-update', buildPayload: (userId) => ({user_id: userId})},
  {type: 'daily-stats-update', buildPayload: (userId, date) => ({user_id: userId, dates: [date]})},
];

// The delete route reads the date back off a timestamp column, which Postgres renders space
// separated; daily-stats-update wants a bare YYYY-MM-DD.
const toDateOnly = (value: string): string => value.trim().split(/[T ]/)[0];

const createJob = async (env: Env, type: string, payload: unknown): Promise<number> => {
  const response = await fetch(`${env.apiUrl}/jobs`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.apiToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({type, payload}),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`${response.status} ${body || 'no body'}`);
  }

  const {id} = (await response.json()) as {id: number};
  return id;
};

export const deleteActivityWithRecalcs = async (
  env: Env,
  userId: number,
  stravaId: string,
): Promise<{start_date: string; jobIds: number[]}> => {
  const response = await fetch(
    `${env.apiUrl}/running/activities/by-strava-id/${encodeURIComponent(stravaId)}`,
    {
      method: 'DELETE',
      headers: {Authorization: `Bearer ${env.apiToken}`},
    },
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `Failed to delete activity ${stravaId} (${response.status}): ${body || 'no body'}`,
    );
  }

  const {start_date} = (await response.json()) as {start_date: string};
  const date = toDateOnly(start_date);

  const jobIds: number[] = [];
  const failures: string[] = [];

  for (const job of POST_DELETE_JOBS) {
    try {
      jobIds.push(await createJob(env, job.type, job.buildPayload(userId, date)));
    } catch (err) {
      failures.push(`${job.type}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  // The row is already gone, so a failed enqueue is not recoverable by retrying the delete —
  // say so plainly instead of reporting success over stale aggregates.
  if (failures.length > 0) {
    const detail = failures.join('; ');
    throw new Error(
      `Activity ${stravaId} was deleted but its recalc jobs could not all be queued, so the aggregates are still stale — requeue them from /admin. Failed: ${detail}`,
    );
  }

  return {start_date, jobIds};
};
