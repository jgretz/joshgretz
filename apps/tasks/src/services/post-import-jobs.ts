import {createJob} from '../api-client';

type PostImportJob = {
  type: string;
  buildPayload: (userId: number) => unknown;
};

const POST_IMPORT_JOBS: PostImportJob[] = [
  {type: 'streak-update', buildPayload: (userId) => ({user_id: userId})},
];

export const schedulePostImportJobs = async (userId: number) => {
  for (const job of POST_IMPORT_JOBS) {
    try {
      const payload = job.buildPayload(userId);
      await createJob(job.type, payload);
      console.log(`Scheduled post-import job: ${job.type} for user ${userId}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.error(`Failed to schedule post-import job ${job.type} for user ${userId}:`, message);
    }
  }
};
