import axios from 'axios';
import { JOSH_USER_ID } from '../constants.ts';
import { type Activity } from '../Types.ts';

export async function getActivities(): Promise<Activity[]> {
  const url = `https://joshgretz-api.fly.dev/running/activities?user_id=${JOSH_USER_ID}`;
  const response = await axios.get<Activity[]>(url);

  return response.data;
}
