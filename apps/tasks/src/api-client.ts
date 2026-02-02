import type {Activity as StravaActivity} from 'strava';
import {config} from './config';

export interface Job {
  id: number;
  type: string;
  status: string;
  payload: unknown;
  result: unknown;
  error_message: string | null;
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
}

export interface ThirdPartyAccess {
  strava_id?: number | null;
  strava_access_token?: string | null;
  strava_code?: string | null;
  strava_refresh_token?: string | null;
  strava_token_expires_at?: string | null;
}

const headers = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${config.TASK_API_KEY}`,
});

const assertOk = async (response: Response, context: string): Promise<void> => {
  if (response.ok) return;
  const body = await response.text().catch(() => '');
  throw new Error(`${context}: ${response.status} ${body}`.trim());
};

export const fetchPendingJobs = async (): Promise<Job[]> => {
  const response = await fetch(`${config.API_URL}/jobs/pending`, {
    headers: headers(),
  });
  await assertOk(response, 'Failed to fetch pending jobs');
  return response.json();
};

export const markJobStarted = async (jobId: number): Promise<void> => {
  const response = await fetch(`${config.API_URL}/jobs/${jobId}/start`, {
    method: 'POST',
    headers: headers(),
  });
  await assertOk(response, `Failed to mark job ${jobId} as started`);
};

export const markJobCompleted = async (jobId: number, result?: unknown): Promise<void> => {
  const response = await fetch(`${config.API_URL}/jobs/${jobId}/complete`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({result}),
  });
  await assertOk(response, `Failed to mark job ${jobId} as completed`);
};

export const markJobFailed = async (jobId: number, errorMessage: string): Promise<void> => {
  const response = await fetch(`${config.API_URL}/jobs/${jobId}/fail`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({error_message: errorMessage}),
  });
  await assertOk(response, `Failed to mark job ${jobId} as failed`);
};

export const getThirdPartyAccess = async (userId: number): Promise<ThirdPartyAccess | undefined> => {
  const response = await fetch(`${config.API_URL}/users/third-party-access?user_id=${userId}`, {
    headers: headers(),
  });
  await assertOk(response, 'Failed to get third-party access');
  const data = await response.json();
  return data || undefined;
};

export const setThirdPartyAccess = async (
  userId: number,
  access: Partial<ThirdPartyAccess>,
): Promise<void> => {
  const response = await fetch(`${config.API_URL}/users/third-party-access`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({user_id: userId, ...access}),
  });
  await assertOk(response, 'Failed to set third-party access');
};

export const createJob = async (type: string, payload: unknown): Promise<{id: number}> => {
  const response = await fetch(`${config.API_URL}/jobs/`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({type, payload}),
  });
  await assertOk(response, `Failed to create job type=${type}`);
  return response.json();
};

export const recalculateStreak = async (userId: number): Promise<void> => {
  const response = await fetch(`${config.API_URL}/streak/recalculate`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({user_id: userId}),
  });
  await assertOk(response, `Failed to recalculate streak for user ${userId}`);
};

export const recalculateStateStats = async (userId: number): Promise<void> => {
  const response = await fetch(`${config.API_URL}/state-stats/recalculate`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({user_id: userId}),
  });
  await assertOk(response, `Failed to recalculate state stats for user ${userId}`);
};

export const recalculateDailyStats = async (userId: number, dates?: string[]): Promise<void> => {
  const response = await fetch(`${config.API_URL}/daily-stats/recalculate`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({user_id: userId, dates}),
  });
  await assertOk(response, `Failed to recalculate daily stats for user ${userId}`);
};

export const storeActivity = async (userId: number, activity: StravaActivity): Promise<void> => {
  const response = await fetch(`${config.API_URL}/running/activities`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({user_id: userId, activity}),
  });
  await assertOk(response, `Failed to store activity strava_id=${activity.id} type=${activity.type}`);
};
