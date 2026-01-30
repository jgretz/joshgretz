import {createServerFn} from '@tanstack/react-start';

type FutureRace = {
  id: number;
  user_id: number;
  title: string;
  location: string | null;
  distance: string | null;
  url: string | null;
  race_date: string | null;
  created_at: string | null;
  updated_at: string | null;
};

const getEnv = () => ({
  apiUrl: process.env.JOSHGRETZ_API_URL || 'http://localhost:3001',
  apiToken: process.env.HELMET || '',
});

export const getFutureRaces = createServerFn({
  method: 'GET',
})
  .inputValidator((data: {userId: number}) => data)
  .handler(async ({data}): Promise<FutureRace[]> => {
    const env = getEnv();

    const response = await fetch(`${env.apiUrl}/future-races?user_id=${data.userId}`, {
      headers: {Authorization: `Bearer ${env.apiToken}`},
    });

    if (!response.ok) {
      throw new Error('Failed to fetch future races');
    }

    return response.json();
  });

export const getFutureRace = createServerFn({
  method: 'GET',
})
  .inputValidator((data: {id: number}) => data)
  .handler(async ({data}): Promise<FutureRace | null> => {
    const env = getEnv();

    const response = await fetch(`${env.apiUrl}/future-races/${data.id}`, {
      headers: {Authorization: `Bearer ${env.apiToken}`},
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error('Failed to fetch future race');
    }

    return response.json();
  });

export const createFutureRace = createServerFn({
  method: 'POST',
})
  .inputValidator(
    (data: {
      userId: number;
      title: string;
      location?: string | null;
      distance?: string | null;
      url?: string | null;
      raceDate?: string | null;
    }) => data,
  )
  .handler(async ({data}): Promise<FutureRace> => {
    const env = getEnv();

    const response = await fetch(`${env.apiUrl}/future-races`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: data.userId,
        title: data.title,
        location: data.location ?? null,
        distance: data.distance ?? null,
        url: data.url ?? null,
        race_date: data.raceDate ?? null,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create future race');
    }

    return response.json();
  });

export const updateFutureRace = createServerFn({
  method: 'POST',
})
  .inputValidator(
    (data: {
      id: number;
      title?: string;
      location?: string | null;
      distance?: string | null;
      url?: string | null;
      raceDate?: string | null;
    }) => data,
  )
  .handler(async ({data}): Promise<FutureRace> => {
    const env = getEnv();

    const body: Record<string, unknown> = {};
    if (data.title !== undefined) body.title = data.title;
    if (data.location !== undefined) body.location = data.location;
    if (data.distance !== undefined) body.distance = data.distance;
    if (data.url !== undefined) body.url = data.url;
    if (data.raceDate !== undefined) body.race_date = data.raceDate;

    const response = await fetch(`${env.apiUrl}/future-races/${data.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${env.apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error('Failed to update future race');
    }

    return response.json();
  });

export const deleteFutureRace = createServerFn({
  method: 'POST',
})
  .inputValidator((data: {id: number}) => data)
  .handler(async ({data}) => {
    const env = getEnv();

    const response = await fetch(`${env.apiUrl}/future-races/${data.id}`, {
      method: 'DELETE',
      headers: {Authorization: `Bearer ${env.apiToken}`},
    });

    if (!response.ok) {
      throw new Error('Failed to delete future race');
    }
  });
