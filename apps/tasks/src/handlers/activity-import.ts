import {getActivity, setupStravaContainer} from 'strava';
import {storeActivity, deleteActivity} from '../api-client';
import {schedulePostImportJobs} from '../services/post-import-jobs';
import {getValidAccessToken} from '../services/strava-token';

export interface ActivityImportPayload {
  user_id: number;
  activity_id: number;
  aspect_type: string;
}

// Strava returns an ISO timestamp, but the delete path reads the stored value back off a
// timestamp column, which Postgres renders space separated ("2026-07-26 08:32:03").
const toDateOnly = (value: string): string => value.trim().split(/[T ]/)[0];

export const handleActivityImport = async (payload: ActivityImportPayload): Promise<{success: boolean}> => {
  const {user_id, activity_id, aspect_type} = payload;

  if (aspect_type === 'delete') {
    console.log(`Deleting activity ${activity_id} for user ${user_id}`);
    const result = await deleteActivity(activity_id);
    if (result?.start_date) {
      const date = toDateOnly(result.start_date);
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

  const date = toDateOnly(activity.start_date_local);
  console.log(`Successfully imported activity ${activity_id}`);

  await schedulePostImportJobs(user_id, [date]);

  return {success: true};
};
