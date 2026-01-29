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

export const fetchPendingJobs = async (): Promise<Job[]> => {
  const response = await fetch(`${config.API_URL}/jobs/pending`, {
    headers: headers(),
  });
  if (!response.ok) throw new Error(`Failed to fetch pending jobs: ${response.status}`);
  return response.json();
};

export const markJobStarted = async (jobId: number): Promise<void> => {
  const response = await fetch(`${config.API_URL}/jobs/${jobId}/start`, {
    method: 'POST',
    headers: headers(),
  });
  if (!response.ok) throw new Error(`Failed to mark job ${jobId} as started: ${response.status}`);
};

export const markJobCompleted = async (jobId: number, result?: unknown): Promise<void> => {
  const response = await fetch(`${config.API_URL}/jobs/${jobId}/complete`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({result}),
  });
  if (!response.ok) throw new Error(`Failed to mark job ${jobId} as completed: ${response.status}`);
};

export const markJobFailed = async (jobId: number, errorMessage: string): Promise<void> => {
  const response = await fetch(`${config.API_URL}/jobs/${jobId}/fail`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({error_message: errorMessage}),
  });
  if (!response.ok) throw new Error(`Failed to mark job ${jobId} as failed: ${response.status}`);
};

export const getThirdPartyAccess = async (userId: number): Promise<ThirdPartyAccess | undefined> => {
  const response = await fetch(`${config.API_URL}/users/third-party-access?user_id=${userId}`, {
    headers: headers(),
  });
  if (!response.ok) throw new Error(`Failed to get third-party access: ${response.status}`);
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
  if (!response.ok) throw new Error(`Failed to set third-party access: ${response.status}`);
};

export const storeActivity = async (userId: number, activity: StravaActivity): Promise<void> => {
  const response = await fetch(`${config.API_URL}/running/activities`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({user_id: userId, activity}),
  });
  if (!response.ok) throw new Error(`Failed to store activity: ${response.status}`);
};
