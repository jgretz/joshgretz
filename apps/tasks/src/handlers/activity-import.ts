import {getActivity, setupStravaContainer} from 'strava';
import {storeActivity} from '../api-client';
import {getValidAccessToken} from '../services/strava-token';

export interface ActivityImportPayload {
  user_id: number;
  activity_id: number;
  aspect_type: string;
}

export const handleActivityImport = async (payload: ActivityImportPayload): Promise<{success: boolean}> => {
  const {user_id, activity_id, aspect_type} = payload;

  // Only handle create events for now
  if (aspect_type !== 'create') {
    console.log(`Skipping activity ${activity_id} - aspect_type: ${aspect_type}`);
    return {success: true};
  }

  console.log(`Importing activity ${activity_id} for user ${user_id}`);

  // Get valid access token (with refresh if needed)
  const accessToken = await getValidAccessToken(user_id);
  setupStravaContainer({accessToken});

  // Fetch and store the activity via API
  const activity = await getActivity(activity_id);
  await storeActivity(user_id, activity);

  console.log(`Successfully imported activity ${activity_id}`);

  return {success: true};
};
