import type {ActivityRow} from '../Types';

const SHEET_NAME = 'Activities';

const HEADERS = [
  'Date',
  'Name',
  'Type',
  'Distance (m)',
  'Moving Time (s)',
  'Elapsed Time (s)',
  'Elevation Gain (m)',
  'Avg Speed (m/s)',
  'Max Speed (m/s)',
  'Avg HR',
  'Max HR',
  'Avg Cadence',
  'Avg Watts',
  'Max Watts',
  'Suffer Score',
  'Location (City)',
  'Location (State)',
  'Elev High (m)',
  'Elev Low (m)',
  'Gear ID',
  'Strava ID',
];

const activityToRow = (a: ActivityRow): (string | null)[] => [
  a.date,
  a.name,
  a.type,
  a.distance,
  a.moving_time,
  a.elapsed_time,
  a.total_elevation_gain,
  a.average_speed,
  a.max_speed,
  a.average_heartrate,
  a.max_heartrate,
  a.average_cadence,
  a.average_watts,
  a.max_watts,
  a.suffer_score,
  a.location_city,
  a.location_state,
  a.elev_high,
  a.elev_low,
  a.gear_id,
  a.strava_id,
];

const assertOk = async (response: Response, context: string) => {
  if (response.ok) return;
  const body = await response.text().catch(() => '');
  throw new Error(`${context}: ${response.status} ${body}`.trim());
};

type WriteOptions = {
  clear?: boolean;
};

const ensureSheetExists = async (
  base: string,
  authHeaders: Record<string, string>,
) => {
  // Check if the Activities tab exists
  const metaResponse = await fetch(`${base}?fields=sheets.properties.title`, {
    headers: authHeaders,
  });
  if (metaResponse.ok) {
    const meta = await metaResponse.json();
    const exists = meta.sheets?.some(
      (s: {properties: {title: string}}) => s.properties.title === SHEET_NAME,
    );
    if (exists) return;
  }

  // Create the tab
  const response = await fetch(`${base}:batchUpdate`, {
    method: 'POST',
    headers: {...authHeaders, 'Content-Type': 'application/json'},
    body: JSON.stringify({
      requests: [{addSheet: {properties: {title: SHEET_NAME}}}],
    }),
  });
  await assertOk(response, 'Failed to create Activities sheet tab');
};

const writeActivities = async (
  accessToken: string,
  spreadsheetId: string,
  activities: ActivityRow[],
  options: WriteOptions = {},
) => {
  const {clear = false} = options;
  const headers = {Authorization: `Bearer ${accessToken}`};
  const base = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`;

  await ensureSheetExists(base, headers);

  if (clear) {
    // clear the sheet before writing
    await fetch(`${base}/values/${SHEET_NAME}:clear`, {
      method: 'POST',
      headers,
    });

    // write header + all rows
    const values = [HEADERS, ...activities.map(activityToRow)];
    const response = await fetch(
      `${base}/values/${SHEET_NAME}!A1?valueInputOption=USER_ENTERED`,
      {
        method: 'PUT',
        headers: {...headers, 'Content-Type': 'application/json'},
        body: JSON.stringify({values}),
      },
    );
    await assertOk(response, 'Failed to write activities to sheet');
    return {rows: activities.length};
  }

  // ensure header row exists before appending
  const headerCheck = await fetch(`${base}/values/${SHEET_NAME}!A1`, {headers});
  const headerData = headerCheck.ok ? await headerCheck.json() : null;
  const hasHeaders = headerData?.values?.length > 0;

  if (!hasHeaders) {
    const headerResponse = await fetch(
      `${base}/values/${SHEET_NAME}!A1?valueInputOption=USER_ENTERED`,
      {
        method: 'PUT',
        headers: {...headers, 'Content-Type': 'application/json'},
        body: JSON.stringify({values: [HEADERS]}),
      },
    );
    await assertOk(headerResponse, 'Failed to write header row');
  }

  // append mode
  const values = activities.map(activityToRow);
  const response = await fetch(
    `${base}/values/${SHEET_NAME}!A1:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    {
      method: 'POST',
      headers: {...headers, 'Content-Type': 'application/json'},
      body: JSON.stringify({values}),
    },
  );
  await assertOk(response, 'Failed to append activities to sheet');
  return {rows: activities.length};
};

export default writeActivities;
