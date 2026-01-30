import {createServerFn} from '@tanstack/react-start';

type PersonalRecord = {
  id: number;
  user_id: number;
  title: string;
  time_seconds: number;
  activity_id: number | null;
  distance: string | null;
  pace_seconds: number | null;
  race_name: string | null;
  race_location: string | null;
  strava_id: string | null;
  race_date: string | null;
  created_at: string | null;
  updated_at: string | null;
};

const getEnv = () => ({
  apiUrl: process.env.JOSHGRETZ_API_URL || 'http://localhost:3001',
  apiToken: process.env.HELMET || '',
});

export const getPersonalRecords = createServerFn({
  method: 'GET',
})
  .inputValidator((data: {userId: number}) => data)
  .handler(async ({data}): Promise<PersonalRecord[]> => {
    const env = getEnv();

    const response = await fetch(`${env.apiUrl}/personal-records?user_id=${data.userId}`, {
      headers: {Authorization: `Bearer ${env.apiToken}`},
    });

    if (!response.ok) {
      throw new Error('Failed to fetch personal records');
    }

    return response.json();
  });

export const getPersonalRecord = createServerFn({
  method: 'GET',
})
  .inputValidator((data: {id: number}) => data)
  .handler(async ({data}): Promise<PersonalRecord | null> => {
    const env = getEnv();

    const response = await fetch(`${env.apiUrl}/personal-records/${data.id}`, {
      headers: {Authorization: `Bearer ${env.apiToken}`},
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error('Failed to fetch personal record');
    }

    return response.json();
  });

export const createPersonalRecord = createServerFn({
  method: 'POST',
})
  .inputValidator(
    (data: {userId: number; title: string; timeSeconds: number; activityId?: number | null}) =>
      data,
  )
  .handler(async ({data}): Promise<PersonalRecord> => {
    const env = getEnv();

    const response = await fetch(`${env.apiUrl}/personal-records`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: data.userId,
        title: data.title,
        time_seconds: data.timeSeconds,
        activity_id: data.activityId ?? null,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create personal record');
    }

    return response.json();
  });

export const updatePersonalRecord = createServerFn({
  method: 'POST',
})
  .inputValidator(
    (data: {id: number; title?: string; timeSeconds?: number; activityId?: number | null}) => data,
  )
  .handler(async ({data}): Promise<PersonalRecord> => {
    const env = getEnv();

    const body: Record<string, unknown> = {};
    if (data.title !== undefined) body.title = data.title;
    if (data.timeSeconds !== undefined) body.time_seconds = data.timeSeconds;
    if (data.activityId !== undefined) body.activity_id = data.activityId;

    const response = await fetch(`${env.apiUrl}/personal-records/${data.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${env.apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error('Failed to update personal record');
    }

    return response.json();
  });

export const deletePersonalRecord = createServerFn({
  method: 'POST',
})
  .inputValidator((data: {id: number}) => data)
  .handler(async ({data}) => {
    const env = getEnv();

    const response = await fetch(`${env.apiUrl}/personal-records/${data.id}`, {
      method: 'DELETE',
      headers: {Authorization: `Bearer ${env.apiToken}`},
    });

    if (!response.ok) {
      throw new Error('Failed to delete personal record');
    }
  });
