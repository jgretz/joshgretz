import {createServerFn} from '@tanstack/react-start';

export type Job = {
  id: number;
  type: string;
  status: string;
  payload: Record<string, string | number | boolean>;
  result: Record<string, string | number | boolean> | null;
  error_message: string | null;
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
};

const getEnv = () => ({
  apiUrl: process.env.JOSHGRETZ_API_URL || 'http://localhost:3001',
  apiToken: process.env.HELMET || '',
});

export const getJobs = createServerFn({
  method: 'GET',
})
  .inputValidator((data: {page?: number}) => data)
  .handler(async ({data}): Promise<{jobs: Job[]; total: number}> => {
    const env = getEnv();
    const params = new URLSearchParams({
      page: String(data.page ?? 1),
      page_size: '30',
    });

    const response = await fetch(`${env.apiUrl}/jobs?${params}`, {
      headers: {Authorization: `Bearer ${env.apiToken}`},
    });

    if (!response.ok) {
      throw new Error('Failed to fetch jobs');
    }

    return response.json();
  });

export const retryJob = createServerFn({
  method: 'POST',
})
  .inputValidator((data: {id: number}) => data)
  .handler(async ({data}) => {
    const env = getEnv();

    const response = await fetch(`${env.apiUrl}/jobs/${data.id}/retry`, {
      method: 'POST',
      headers: {Authorization: `Bearer ${env.apiToken}`},
    });

    if (!response.ok) {
      throw new Error('Failed to retry job');
    }
  });
