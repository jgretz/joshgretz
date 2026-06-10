import {createServerFn} from '@tanstack/react-start';

type StateStat = {
  id: number;
  user_id: number;
  state: string;
  run_count: number | null;
  marathon_count: number | null;
  first_marathon_name: string | null;
  first_marathon_date: string | null;
  first_marathon_strava_id: string | null;
  created_at: string | null;
  updated_at: string | null;
};

const getEnv = () => ({
  apiUrl: process.env.JOSHGRETZ_API_URL || 'http://localhost:3001',
  apiToken: process.env.HELMET || '',
});

export const getStateStats = createServerFn({
  method: 'GET',
})
  .inputValidator((data: {userId: number}) => data)
  .handler(async ({data}): Promise<StateStat[]> => {
    const env = getEnv();

    const response = await fetch(`${env.apiUrl}/state-stats?user_id=${data.userId}`, {
      headers: {Authorization: `Bearer ${env.apiToken}`},
    });

    if (!response.ok) {
      throw new Error('Failed to fetch state stats');
    }

    return response.json();
  });

export const enqueueStateStatsRecalc = createServerFn({
  method: 'POST',
})
  .inputValidator((data: {userId: number}) => data)
  .handler(async ({data}): Promise<{id: number}> => {
    const env = getEnv();

    const response = await fetch(`${env.apiUrl}/jobs`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'state-stats-update',
        payload: {user_id: data.userId},
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Failed to enqueue state stats recalc (${response.status}): ${body}`);
    }

    return response.json();
  });
