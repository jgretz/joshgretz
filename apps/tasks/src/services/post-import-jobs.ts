import {createJob} from '../api-client';

type PostImportJob = {
  type: string;
  buildPayload: (userId: number, dates?: string[]) => unknown;
};

const POST_IMPORT_JOBS: PostImportJob[] = [
  {type: 'streak-update', buildPayload: (userId) => ({user_id: userId})},
  {type: 'state-stats-update', buildPayload: (userId) => ({user_id: userId})},
  {type: 'daily-stats-update', buildPayload: (userId, dates) => ({user_id: userId, dates})},
  {
    type: 'google-sheets-sync',
    buildPayload: (userId, dates) => ({
      user_id: userId,
      from: dates?.[0],
      to: dates?.[dates.length - 1],
    }),
  },
];

export const schedulePostImportJobs = async (userId: number, dates?: string[]) => {
  for (const job of POST_IMPORT_JOBS) {
    try {
      const payload = job.buildPayload(userId, dates);
      await createJob(job.type, payload);
      console.log(`Scheduled post-import job: ${job.type} for user ${userId}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.error(`Failed to schedule post-import job ${job.type} for user ${userId}:`, message);
    }
  }
};
