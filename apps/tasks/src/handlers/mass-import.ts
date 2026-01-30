import {getActivities, setupStravaContainer} from 'strava';
import {storeActivity} from '../api-client';
import {schedulePostImportJobs} from '../services/post-import-jobs';
import {getValidAccessToken} from '../services/strava-token';

export interface MassImportPayload {
  user_id: number;
  from: string;
  to: string;
}

export const handleMassImport = async (payload: MassImportPayload) => {
  const {user_id, from, to} = payload;

  console.log(`Starting mass import for user ${user_id} from ${from} to ${to}`);

  const accessToken = await getValidAccessToken(user_id);
  setupStravaContainer({accessToken});

  const activities = await getActivities({
    before: new Date(to),
    after: new Date(from),
  });

  const runs = activities.filter((a) => a.type === 'Run');
  const skipped = activities.length - runs.length;

  console.log(`Found ${activities.length} activities, ${runs.length} runs (skipping ${skipped} non-runs)`);

  const errors: {strava_id: number; type: string; error: string}[] = [];
  let imported = 0;

  for (const activity of runs) {
    try {
      await storeActivity(user_id, activity);
      imported++;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.error(`Failed to store activity strava_id=${activity.id} type=${activity.type}:`, message);
      console.error('Activity payload:', JSON.stringify(activity, null, 2));
      errors.push({strava_id: activity.id, type: activity.type, error: message});
    }
  }

  console.log(`Imported ${imported}/${activities.length} activities for user ${user_id}`);

  if (errors.length > 0) {
    console.error(`${errors.length} activities failed:`, errors);
    throw new Error(
      `Imported ${imported}/${activities.length}. Failed: ${errors.map((e) => `${e.strava_id} (${e.type}): ${e.error}`).join('; ')}`,
    );
  }

  const dates = [...new Set(runs.map((a) => a.start_date_local.split('T')[0]))];
  await schedulePostImportJobs(user_id, dates);

  return {imported, total: activities.length};
};
