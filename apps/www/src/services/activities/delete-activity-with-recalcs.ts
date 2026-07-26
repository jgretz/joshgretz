// Deleting an activity and rebuilding the aggregates is one operation. The API delete route
// only removes the row, so whoever calls it has to enqueue the recalcs — a delete without them
// leaves the streak, state and daily aggregates permanently counting an activity that no longer
// exists, which is exactly the failure this admin view exists to correct.

type Env = {
  apiUrl: string;
  apiToken: string;
};

// Every recalc job takes the user; only the daily one is scoped to specific dates.
type RecalcJobPayload = {
  user_id: number;
  dates?: string[];
};

type PostDeleteJob = {
  type: string;
  buildPayload: (userId: number, date: string) => RecalcJobPayload;
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

const errorMessage = (reason: unknown): string =>
  reason instanceof Error ? reason.message : String(reason);

const createJob = async (env: Env, type: string, payload: RecalcJobPayload): Promise<number> => {
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

  // A 404 has to read as a failure, never as a quiet success — nothing was queued, so anything
  // that *was* removed would leave the aggregates stale with no trace. The route also answers
  // 404 for a row it deleted but whose `start_date_local` was NULL, so the message must not
  // promise the activity is still there.
  if (response.status === 404) {
    throw new Error(
      `Activity ${stravaId} returned 404 from the delete: either no such activity, or one that was removed without a start date to recalculate from. No recalc jobs were queued — re-check the activity before assuming nothing changed.`,
    );
  }

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `Failed to delete activity ${stravaId} (${response.status}): ${body || 'no body'}`,
    );
  }

  const {start_date} = (await response.json()) as {start_date: string};
  const date = toDateOnly(start_date);

  // allSettled, not all: the row is already gone, so one refused enqueue must not hide which of
  // the other two made it into the queue.
  const outcomes = await Promise.allSettled(
    POST_DELETE_JOBS.map((job) => createJob(env, job.type, job.buildPayload(userId, date))),
  );

  const failures = outcomes.flatMap((outcome, index) =>
    outcome.status === 'rejected'
      ? [`${POST_DELETE_JOBS[index].type}: ${errorMessage(outcome.reason)}`]
      : [],
  );

  // Retrying the delete cannot fix this — the row is gone. Say so plainly instead of reporting
  // success over stale aggregates.
  if (failures.length > 0) {
    const detail = failures.join('; ');
    throw new Error(
      `Activity ${stravaId} was deleted but its recalc jobs could not all be queued, so the aggregates are still stale — requeue them from /admin/jobs. Failed: ${detail}`,
    );
  }

  return {
    start_date,
    jobIds: outcomes.flatMap((outcome) => (outcome.status === 'fulfilled' ? [outcome.value] : [])),
  };
};
