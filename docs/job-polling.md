# Job Polling

The tasks runner polls `GET /jobs/pending` every 5 s. Neon bills per CU-hour and
suspends compute only after 5 minutes with no queries, so a query on every poll kept
the database awake 24/7 (~900 CU-seconds every hour). The API therefore gates that
endpoint in-process: `apps/api/src/jobs/pending-jobs-gate.ts`.

## Flag rules

- **True at process start.** Jobs may have been created before the process started.
- **Set** whenever the API creates a job (`enqueueJob`) or retries one
  (`POST /jobs/:id/retry`).
- **Cleared** when a `/pending` query returns no rows. A mark that lands while that
  query is in flight keeps the flag set.
- **While clear**, `/pending` returns `[]` without touching the database.
- **Safety net:** the gate re-queries every 120 minutes (`PENDING_JOBS_RECHECK_MS`)
  even when clear, so a job inserted outside the API (manual SQL) waits at most that
  long. The interval is long because each recheck bills at least 5 minutes of Neon
  compute (~75 CU-seconds).

Idle load is one query per 120 minutes per API machine: about one every two hours,
down from 720 an hour.

## Create jobs only through `enqueueJob`

`apps/api/src/jobs/enqueue-job.ts` is the one place that inserts into `jobs`; it sets
the flag after the insert. A direct `insert(Schema.jobs)` elsewhere would leave the
job invisible until the next recheck. `apps/api/tests/job-insert-sites.test.ts` fails
if one appears in `apps/api/src` or `packages/*/src`.

## Multi-machine caveat

The flag is per process. With more than one Fly API machine, a job created on machine
B is picked up by the next poll that lands on B. If B auto-stops before any poll
reaches it, the job waits for another machine's safety net: at most 120 minutes.
Restarts and deploys start with the flag set, so no job is lost across them. The app
currently has a stopped standby machine in ord that Fly starts under load or when
ewr is unavailable; running one API machine removes the caveat.
