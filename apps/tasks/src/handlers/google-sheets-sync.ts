import {writeActivities, type ActivityRow} from 'google-sheets';
import {fetchActivitiesByDateRange} from '../api-client';
import {getValidGoogleAccessToken} from '../services/google-token';

export type GoogleSheetsSyncPayload = {
  user_id: number;
  from?: string;
  to?: string;
  full_sync?: boolean;
};

const toActivityRow = (a: Record<string, unknown>): ActivityRow => ({
  date: (a.start_date_local as string) ?? null,
  name: (a.name as string) ?? null,
  type: (a.type as string) ?? null,
  distance: (a.distance as string) ?? null,
  moving_time: (a.moving_time as string) ?? null,
  elapsed_time: (a.elapsed_time as string) ?? null,
  total_elevation_gain: (a.total_elevation_gain as string) ?? null,
  average_speed: (a.average_speed as string) ?? null,
  max_speed: (a.max_speed as string) ?? null,
  average_heartrate: (a.average_heartrate as string) ?? null,
  max_heartrate: (a.max_heartrate as string) ?? null,
  average_cadence: (a.average_cadence as string) ?? null,
  average_watts: (a.average_watts as string) ?? null,
  max_watts: (a.max_watts as string) ?? null,
  suffer_score: (a.suffer_score as string) ?? null,
  location_city: (a.location_city as string) ?? null,
  location_state: (a.location_state as string) ?? null,
  elev_high: (a.elev_high as string) ?? null,
  elev_low: (a.elev_low as string) ?? null,
  gear_id: (a.gear_id as string) ?? null,
  strava_id: (a.strava_id as string) ?? null,
});

export const handleGoogleSheetsSync = async (payload: GoogleSheetsSyncPayload) => {
  const {user_id, from, to, full_sync} = payload;

  console.log(
    `Starting Google Sheets sync for user ${user_id}`,
    full_sync ? '(full sync)' : `from=${from} to=${to}`,
  );

  const {accessToken, spreadsheetId} = await getValidGoogleAccessToken(user_id);

  const activities = await fetchActivitiesByDateRange(user_id, from, to);
  const rows = activities.map(toActivityRow);

  console.log(`Writing ${rows.length} activities to sheet ${spreadsheetId}`);

  const result = await writeActivities(accessToken, spreadsheetId, rows, {
    clear: full_sync ?? false,
  });

  console.log(`Google Sheets sync complete: ${result.rows} rows written`);

  return {rows_written: result.rows};
};
