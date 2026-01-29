import {createServerFn} from '@tanstack/react-start';

type Activity = {
  id: number;
  name: string | null;
  strava_id: string;
  start_date_local: string | null;
  distance: string | null;
};

const getEnv = () => ({
  apiUrl: process.env.JOSHGRETZ_API_URL || 'http://localhost:3001',
  apiToken: process.env.HELMET || '',
});

export const searchActivities = createServerFn({
  method: 'GET',
})
  .inputValidator((data: {userId: number; q?: string; stravaId?: string}) => data)
  .handler(async ({data}): Promise<Activity[]> => {
    const env = getEnv();

    const params = new URLSearchParams({user_id: String(data.userId)});
    if (data.q) params.set('q', data.q);
    if (data.stravaId) params.set('strava_id', data.stravaId);

    const response = await fetch(`${env.apiUrl}/running/activities/search?${params}`, {
      headers: {Authorization: `Bearer ${env.apiToken}`},
    });

    if (!response.ok) {
      throw new Error('Failed to search activities');
    }

    return response.json();
  });
