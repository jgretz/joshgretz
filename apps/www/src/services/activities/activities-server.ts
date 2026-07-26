import {createServerFn} from '@tanstack/react-start';
import {deleteActivityWithRecalcs} from './delete-activity-with-recalcs';

type Activity = {
  id: number;
  name: string | null;
  strava_id: string;
  start_date_local: string | null;
  distance: string | null;
  moving_time: string | null;
  location_city: string | null;
  location_state: string | null;
  location_country: string | null;
  featured_marathon: boolean | null;
};

type ActivityDetailsUpdate = {
  location_city?: string | null;
  location_state?: string | null;
  location_country?: string | null;
  featured_marathon?: boolean;
};

export type DuplicateActivitySide = {
  id: number;
  strava_id: string;
  name: string | null;
  type: string | null;
  start_date: string | null;
  start_date_local: string | null;
  distance: string | null;
  moving_time: string | null;
  elapsed_time: string | null;
  total_elevation_gain: string | null;
  average_heartrate: string | null;
  gear_id: string | null;
  start_lat: string | null;
  start_lng: string | null;
  location_city: string | null;
  location_state: string | null;
  location_country: string | null;
  featured_marathon: boolean | null;
};

export type DuplicateActivityCandidate = {
  a: DuplicateActivitySide;
  b: DuplicateActivitySide;
  start_delta_seconds: number;
  distance_delta_meters: string;
};

type DuplicateTolerances = {
  windowSeconds?: number;
  distanceTolerancePct?: number;
  distanceToleranceMeters?: number;
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

export const updateActivityDetails = createServerFn({
  method: 'POST',
})
  .inputValidator((data: {id: number; details: ActivityDetailsUpdate}) => data)
  .handler(async ({data}): Promise<Activity> => {
    const env = getEnv();

    const response = await fetch(`${env.apiUrl}/running/activities/${data.id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${env.apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data.details),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Failed to update activity (${response.status}): ${body}`);
    }

    return response.json();
  });

export const getDuplicateActivities = createServerFn({
  method: 'GET',
})
  .inputValidator((data: {userId: number} & DuplicateTolerances) => data)
  .handler(async ({data}): Promise<DuplicateActivityCandidate[]> => {
    const env = getEnv();

    const params = new URLSearchParams({user_id: String(data.userId)});
    if (data.windowSeconds !== undefined) params.set('window_seconds', String(data.windowSeconds));
    if (data.distanceTolerancePct !== undefined) {
      params.set('distance_tolerance_pct', String(data.distanceTolerancePct));
    }
    if (data.distanceToleranceMeters !== undefined) {
      params.set('distance_tolerance_meters', String(data.distanceToleranceMeters));
    }

    const response = await fetch(`${env.apiUrl}/running/activities/duplicates?${params}`, {
      headers: {Authorization: `Bearer ${env.apiToken}`},
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Failed to fetch duplicate activities (${response.status}): ${body}`);
    }

    return response.json();
  });

export const deleteActivityAndRecalculate = createServerFn({
  method: 'POST',
})
  .inputValidator((data: {userId: number; stravaId: string}) => data)
  .handler(async ({data}): Promise<{start_date: string; jobIds: number[]}> => {
    return await deleteActivityWithRecalcs(getEnv(), data.userId, data.stravaId);
  });
