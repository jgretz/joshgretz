import {createServerFn} from '@tanstack/react-start';

type StateStat = {
  id: number;
  user_id: number;
  state: string;
  run_count: number | null;
  marathon_count: number | null;
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
