import {StravaMessages} from 'strava';
import {UsersMessages} from 'users';
import {Workflow} from 'workflow';
import {RunningWorkflows} from '../Types';
import {parseISO} from 'date-fns';
import {storeStravaActivity} from './services/storeStravaActivity';

function prepareForStravaQuery(payload: any) {
  return {
    accessToken: payload.access.strava_access_token,
    from: parseISO(payload.from),
    to: parseISO(payload.to),
  };
}

async function importActivities(payload: any) {
  await Promise.all(
    payload.activities.map((activity: any) => storeStravaActivity(activity, payload.user_id)),
  );
}

export const importStravaActivitiesForDateRange = new Workflow(
  RunningWorkflows.ImportStravaActivitiesForDateRange,
)
  .use(UsersMessages.ThirdPartyAccessForUser)
  .use(prepareForStravaQuery)
  .use(StravaMessages.LoadActivitiesForDateRange)
  .use(importActivities);
