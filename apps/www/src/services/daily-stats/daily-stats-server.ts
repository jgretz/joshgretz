import {createServerFn} from '@tanstack/react-start';

type DailyStat = {
  id: number;
  user_id: number;
  date: string;
  total_miles: string | null;
  run_count: number | null;
  created_at: string | null;
  updated_at: string | null;
};

const getEnv = () => ({
  apiUrl: process.env.JOSHGRETZ_API_URL || 'http://localhost:3001',
  apiToken: process.env.HELMET || '',
});

export const getDailyStats = createServerFn({
  method: 'GET',
})
  .inputValidator((data: {userId: number; year: number}) => data)
  .handler(async ({data}): Promise<DailyStat[]> => {
    const env = getEnv();

    const response = await fetch(
      `${env.apiUrl}/daily-stats?user_id=${data.userId}&year=${data.year}`,
      {
        headers: {Authorization: `Bearer ${env.apiToken}`},
      },
    );

    if (!response.ok) {
      throw new Error('Failed to fetch daily stats');
    }

    return response.json();
  });
