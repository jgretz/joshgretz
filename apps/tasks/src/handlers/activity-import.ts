import {getActivity, setupStravaContainer} from 'strava';
import {storeActivity, deleteActivity} from '../api-client';
import {schedulePostImportJobs} from '../services/post-import-jobs';
import {getValidAccessToken} from '../services/strava-token';

export interface ActivityImportPayload {
  user_id: number;
  activity_id: number;
  aspect_type: string;
}

export const handleActivityImport = async (payload: ActivityImportPayload): Promise<{success: boolean}> => {
  const {user_id, activity_id, aspect_type} = payload;

  if (aspect_type === 'delete') {
    console.log(`Deleting activity ${activity_id} for user ${user_id}`);
    const result = await deleteActivity(activity_id);
    if (result?.start_date) {
      const date = result.start_date.split('T')[0];
      console.log(`Deleted activity ${activity_id}, recalculating stats for ${date}`);
      await schedulePostImportJobs(user_id, [date]);
    } else {
      console.log(`Activity ${activity_id} not found in DB, nothing to delete`);
    }
    return {success: true};
  }

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

  const date = activity.start_date_local.split('T')[0];
  console.log(`Successfully imported activity ${activity_id}`);

  await schedulePostImportJobs(user_id, [date]);

  return {success: true};
};
