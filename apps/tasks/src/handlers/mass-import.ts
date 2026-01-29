import {getActivities, setupStravaContainer} from 'strava';
import {storeActivity} from '../api-client';
import {getValidAccessToken} from '../services/strava-token';

export interface MassImportPayload {
  user_id: number;
  from: string;
  to: string;
}

export const handleMassImport = async (payload: MassImportPayload): Promise<{imported: number}> => {
  const {user_id, from, to} = payload;

  console.log(`Starting mass import for user ${user_id} from ${from} to ${to}`);

  // Get valid access token (with refresh if needed)
  const accessToken = await getValidAccessToken(user_id);
  setupStravaContainer({accessToken});

  // Load activities from strava
  const activities = await getActivities({
    before: new Date(to),
    after: new Date(from),
  });

  // Import activities via API
  await Promise.all(activities.map((activity) => storeActivity(user_id, activity)));

  console.log(`Imported ${activities.length} activities for user ${user_id}`);

  return {imported: activities.length};
};
