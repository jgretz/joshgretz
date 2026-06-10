import type PgBoss from 'pg-boss';
import {config} from './config';
import {
  createJob,
  fetchPendingJobs,
  markJobStarted,
  markJobCompleted,
  markJobFailed,
} from './api-client';
import {processJob} from './handlers';
import {runWithAutoRecovery} from './connectionManager';

// pg-boss queue used purely as a cron trigger. When it fires it enqueues an
// app-level `files-cleanup` job, which the poll loop processes like any other.
const FILES_CLEANUP_QUEUE = 'scheduled-files-cleanup';
const FILES_CLEANUP_CRON = '0 */12 * * *'; // twice daily, 00:00 and 12:00 UTC
const FILES_RETENTION_DAYS = 30;

const pollForJobs = async () => {
  try {
    const jobs = await fetchPendingJobs();

    for (const job of jobs) {
      try {
        console.log(`Processing job ${job.id} (${job.type})`);
        await markJobStarted(job.id);

        const result = await processJob(job.type, job.payload);

        await markJobCompleted(job.id, result);
        console.log(`Job ${job.id} completed successfully`);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error(`Job ${job.id} failed:`, message);
        await markJobFailed(job.id, message);
      }
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error polling for jobs:', message);
  }
};

const scheduleFilesCleanup = async (boss: PgBoss) => {
  // createQueue is idempotent across restarts; ignore "already exists".
  try {
    await boss.createQueue(FILES_CLEANUP_QUEUE);
  } catch (error) {
    console.error(
      'createQueue (files cleanup):',
      error instanceof Error ? error.message : String(error),
    );
  }

  await boss.work(FILES_CLEANUP_QUEUE, async () => {
    console.log('Scheduled trigger fired: enqueueing files-cleanup job');
    await createJob('files-cleanup', {days: FILES_RETENTION_DAYS});
  });

  // schedule() upserts the cron, so re-running on restart is safe.
  await boss.schedule(FILES_CLEANUP_QUEUE, FILES_CLEANUP_CRON, {}, {tz: 'UTC'});

  console.log(`Scheduled files-cleanup (${FILES_CLEANUP_CRON} UTC)`);
};

const start = async () => {
  console.log('Starting task runner...');

  await runWithAutoRecovery(async (boss) => {
    // Poll for jobs on interval
    setInterval(pollForJobs, config.POLL_INTERVAL_MS);

    // Initial poll
    await pollForJobs();

    // Register the twice-daily files-cleanup cron trigger
    await scheduleFilesCleanup(boss);

    console.log(`Task runner started, polling every ${config.POLL_INTERVAL_MS}ms`);
  });
};

start().catch(console.error);
