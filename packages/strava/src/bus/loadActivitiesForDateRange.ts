import type {BusService} from 'workflow';
import {StravaMessages, type Activity} from '../Types';
import {setupStravaContainer} from 'strava';
import getActivities from '../activities/getActivities';
import {parseISO} from 'date-fns';

interface LoadActivitiesForDateRangeArgs {
  accessToken: string;
  from: string;
  to: string;
}

interface LoadActivitiesForDateRangeResponse {
  activities: Activity[];
}

async function execute({accessToken, from, to}: LoadActivitiesForDateRangeArgs) {
  setupStravaContainer({accessToken});

  const activities = await getActivities({before: parseISO(to), after: parseISO(from)});
  return {activities};
}

export const LoadActivitiesForDateRange: BusService<
  LoadActivitiesForDateRangeArgs,
  LoadActivitiesForDateRangeResponse
> = {
  key: StravaMessages.LoadActivitiesForDateRange,

  execute,
};
