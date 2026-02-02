import {config} from './config';
import {fetchPendingJobs, markJobStarted, markJobCompleted, markJobFailed} from './api-client';
import {processJob} from './handlers';
import {runWithAutoRecovery} from './connectionManager';

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

const start = async () => {
  console.log('Starting task runner...');

  await runWithAutoRecovery(async () => {
    // Poll for jobs on interval
    setInterval(pollForJobs, config.POLL_INTERVAL_MS);

    // Initial poll
    await pollForJobs();

    console.log(`Task runner started, polling every ${config.POLL_INTERVAL_MS}ms`);
  });
};

start().catch(console.error);
