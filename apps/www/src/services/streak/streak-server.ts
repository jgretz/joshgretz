import {createServerFn} from '@tanstack/react-start';

type Streak = {
  id: number;
  user_id: number;
  start_date: string | null;
  total_runs: number | null;
  total_miles: string | null;
  total_vert: number | null;
  last_run_date: string | null;
  created_at: string | null;
  updated_at: string | null;
};

const getEnv = () => ({
  apiUrl: process.env.JOSHGRETZ_API_URL || 'http://localhost:3001',
  apiToken: process.env.HELMET || '',
});

export const getStreak = createServerFn({
  method: 'GET',
})
  .inputValidator((data: {userId: number}) => data)
  .handler(async ({data}): Promise<Streak | null> => {
    const env = getEnv();

    const response = await fetch(`${env.apiUrl}/streak?user_id=${data.userId}`, {
      headers: {Authorization: `Bearer ${env.apiToken}`},
    });

    if (!response.ok) {
      throw new Error('Failed to fetch streak');
    }

    const text = await response.text();
    if (!text) return null;

    return JSON.parse(text);
  });

export const upsertStreak = createServerFn({
  method: 'POST',
})
  .inputValidator(
    (data: {
      userId: number;
      startDate?: string | null;
      totalRuns?: number | null;
      totalMiles?: string | null;
      totalVert?: number | null;
      lastRunDate?: string | null;
    }) => data,
  )
  .handler(async ({data}): Promise<Streak> => {
    const env = getEnv();

    const response = await fetch(`${env.apiUrl}/streak`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${env.apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: data.userId,
        start_date: data.startDate ?? null,
        total_runs: data.totalRuns ?? null,
        total_miles: data.totalMiles ?? null,
        total_vert: data.totalVert ?? null,
        last_run_date: data.lastRunDate ?? null,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to upsert streak');
    }

    return response.json();
  });
